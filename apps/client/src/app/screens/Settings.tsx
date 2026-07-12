import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ArrowLeft, Volume2, Monitor, Gamepad2, Globe, Bell, Lock, Cloud, LogOut, Download, Trash2 } from "lucide-react";
import { API_URL, changePassword, checkApiHealth, deleteAccount, downloadSaveBlob } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useSave } from "@/context/SaveContext";
import { useSimulation } from "@/context/SimulationContext";
import {
  DEFAULT_PLAYER_SETTINGS,
  loadPlayerSettings,
  savePlayerSettings,
  type Difficulty,
  type GraphicsQuality,
  type PlayerSettings,
} from "@/lib/player-settings";
import { LifeShell } from "../components/shell";

export default function Settings() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateDisplayName } = useAuth();
  const { activeSave, clearActiveSave, deleteSaveById } = useSave();
  const { persistNow, world, formattedDate } = useSimulation();
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);
  const [settings, setSettings] = useState<PlayerSettings>(DEFAULT_PLAYER_SETTINGS);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [saveActionError, setSaveActionError] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    setSettings(loadPlayerSettings());
    checkApiHealth().then(setApiOnline);
  }, []);

  useEffect(() => {
    setDisplayName(user?.displayName ?? "");
  }, [user?.displayName]);

  function updateSettings<K extends keyof PlayerSettings>(key: K, value: PlayerSettings[K]) {
    setSettings((current) => ({ ...current, [key]: value }));
    setSavedMessage(null);
  }

  function handleSave() {
    savePlayerSettings(settings);
    setSavedMessage("Settings saved.");
  }

  function handleLogout() {
    clearActiveSave();
    logout();
    navigate("/");
  }

  async function handleExportSave() {
    if (!activeSave) {
      return;
    }

    setSaveActionError(null);
    setIsExporting(true);
    try {
      await persistNow();
      const blob = await downloadSaveBlob(activeSave.id);
      const file = new Blob([blob], { type: "application/json" });
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${activeSave.name.replace(/\s+/g, "-")}-save.json`;
      link.click();
      URL.revokeObjectURL(url);
      setSavedMessage("Save exported.");
    } catch (error) {
      setSaveActionError(error instanceof Error ? error.message : "Export failed.");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleDeleteSave() {
    if (!activeSave) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${activeSave.name}" permanently? This cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }

    setSaveActionError(null);
    setIsDeleting(true);
    try {
      await deleteSaveById(activeSave.id);
      clearActiveSave();
      navigate("/continue");
    } catch (error) {
      setSaveActionError(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleUpdateProfile() {
    setAccountError(null);
    setIsUpdatingProfile(true);
    try {
      await updateDisplayName(displayName.trim());
      setSavedMessage("Profile updated.");
    } catch (error) {
      setAccountError(error instanceof Error ? error.message : "Profile update failed.");
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  async function handleChangePassword() {
    setAccountError(null);
    setIsChangingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setSavedMessage("Password changed.");
    } catch (error) {
      setAccountError(error instanceof Error ? error.message : "Password change failed.");
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Delete your Fenix Life account and all saves permanently?",
    );
    if (!confirmed) {
      return;
    }

    setAccountError(null);
    setIsDeletingAccount(true);
    try {
      await deleteAccount(deletePassword);
      clearActiveSave();
      logout();
      navigate("/");
    } catch (error) {
      setAccountError(error instanceof Error ? error.message : "Account deletion failed.");
    } finally {
      setIsDeletingAccount(false);
    }
  }

  return (
    <LifeShell
      playerName={world?.player.displayName}
      ageYears={world?.player.ageYears}
      dateLabel={formattedDate ?? undefined}
      statusLine="Settings"
      showDock={Boolean(activeSave)}
    >
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate(activeSave ? "/home" : "/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {activeSave ? "Back to Home" : "Back to Menu"}
          </Button>
          <div>
            <h1 className="text-3xl text-secondary">Settings</h1>
            <p className="text-gray-600">Customize your experience</p>
          </div>
        </div>

        <div className="space-y-6">
          <section className="border-y border-border py-5">
              <h2 className="text-secondary flex items-center gap-2">
                <Monitor className="w-5 h-5 text-accent" />
                Graphics
              </h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-secondary">Quality</div>
                  <div className="text-sm text-gray-600">Adjust visual quality</div>
                </div>
                <Select
                  value={settings.graphicsQuality}
                  onValueChange={(value) => updateSettings("graphicsQuality", value as GraphicsQuality)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="ultra">Ultra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-secondary">Fullscreen</div>
                  <div className="text-sm text-gray-600">Enable fullscreen mode</div>
                </div>
                <Switch
                  checked={settings.fullscreen}
                  onCheckedChange={(checked) => updateSettings("fullscreen", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-secondary">V-Sync</div>
                  <div className="text-sm text-gray-600">Synchronize frame rate</div>
                </div>
                <Switch
                  checked={settings.vSync}
                  onCheckedChange={(checked) => updateSettings("vSync", checked)}
                />
              </div>
            </div>
          </section>

          <section className="border-b border-border pb-5">
              <h2 className="text-secondary flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-fenix-gold" />
                Audio
              </h2>
            <div className="mt-4 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-secondary">Master Volume</div>
                  <div className="text-sm text-gray-600">{settings.masterVolume}%</div>
                </div>
                <Slider
                  value={[settings.masterVolume]}
                  max={100}
                  step={1}
                  onValueChange={([value]) => updateSettings("masterVolume", value ?? settings.masterVolume)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-secondary">Music Volume</div>
                  <div className="text-sm text-gray-600">{settings.musicVolume}%</div>
                </div>
                <Slider
                  value={[settings.musicVolume]}
                  max={100}
                  step={1}
                  onValueChange={([value]) => updateSettings("musicVolume", value ?? settings.musicVolume)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-secondary">Effects Volume</div>
                  <div className="text-sm text-gray-600">{settings.effectsVolume}%</div>
                </div>
                <Slider
                  value={[settings.effectsVolume]}
                  max={100}
                  step={1}
                  onValueChange={([value]) => updateSettings("effectsVolume", value ?? settings.effectsVolume)}
                />
              </div>
            </div>
          </section>

          <section className="border-b border-border pb-5">
              <h2 className="text-secondary flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-accent" />
                Gameplay
              </h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-secondary">Difficulty</div>
                  <div className="text-sm text-gray-600">Game difficulty level</div>
                </div>
                <Select
                  value={settings.difficulty}
                  onValueChange={(value) => updateSettings("difficulty", value as Difficulty)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-secondary">Autosave</div>
                  <div className="text-sm text-gray-600">Persist simulation progress to the cloud</div>
                </div>
                <Switch
                  checked={settings.autosave}
                  onCheckedChange={(checked) => updateSettings("autosave", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-secondary">Tutorial Hints</div>
                  <div className="text-sm text-gray-600">Show helpful tips</div>
                </div>
                <Switch
                  checked={settings.tutorialHints}
                  onCheckedChange={(checked) => updateSettings("tutorialHints", checked)}
                />
              </div>
            </div>
          </section>

          <section className="border-b border-border pb-5">
              <h2 className="text-secondary flex items-center gap-2">
                <Globe className="w-5 h-5 text-accent" />
                General
              </h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-secondary">Language</div>
                  <div className="text-sm text-gray-600">Select language</div>
                </div>
                <Select
                  value={settings.language}
                  onValueChange={(value) => updateSettings("language", value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-secondary flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </div>
                  <div className="text-sm text-gray-600">Enable game notifications</div>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => updateSettings("notifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-secondary flex items-center gap-2">
                    <Cloud className="w-4 h-4" />
                    Cloud Saves
                  </div>
                  <div className="text-sm text-gray-600">
                    API: {API_URL}
                    {apiOnline === null && " — checking…"}
                    {apiOnline === true && " — connected"}
                    {apiOnline === false && " — offline (run api locally or deploy)"}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Preference only — saves always sync when autosave is on.</p>
                </div>
                <Switch
                  checked={settings.cloudSaves}
                  onCheckedChange={(checked) => updateSettings("cloudSaves", checked)}
                />
              </div>
            </div>
          </section>

          {isAuthenticated && activeSave ? (
            <section className="border-b border-border pb-5">
                <h2 className="text-secondary flex items-center gap-2">
                  <Cloud className="w-5 h-5 text-fenix-gold" />
                  Save Management
                </h2>
              <div className="mt-4 space-y-4">
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                  <dt className="text-muted-foreground">Active life</dt>
                  <dd className="font-medium text-secondary">{activeSave.name}</dd>
                  <dt className="text-muted-foreground">Schema</dt>
                  <dd>v{activeSave.schemaVersion}</dd>
                </dl>
                {saveActionError ? <p className="text-sm text-red-600">{saveActionError}</p> : null}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleExportSave}
                  disabled={isExporting || isDeleting}
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? "Exporting…" : "Export Save JSON"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleDeleteSave}
                  disabled={isExporting || isDeleting}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {isDeleting ? "Deleting…" : "Delete Current Life"}
                </Button>
              </div>
            </section>
          ) : null}

          <section className="border-b border-border pb-5">
              <h2 className="text-secondary flex items-center gap-2">
                <Lock className="w-5 h-5 text-secondary" />
                Privacy & Account
              </h2>
            <div className="mt-4 space-y-4">
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                <dt className="text-muted-foreground">Signed in as</dt>
                <dd className="font-medium text-secondary">{user?.displayName ?? user?.email}</dd>
                <dt className="text-muted-foreground">Email</dt>
                <dd>{user?.email}</dd>
              </dl>
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
              {accountError ? <p className="text-sm text-red-600">{accountError}</p> : null}
              <div className="space-y-2">
                <Label htmlFor="displayName">Display name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                />
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleUpdateProfile}
                  disabled={!isAuthenticated || isUpdatingProfile}
                >
                  Manage Account
                </Button>
              </div>
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleChangePassword}
                  disabled={!isAuthenticated || isChangingPassword || !currentPassword || !newPassword}
                >
                  Change Password
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Privacy preferences are managed under General → Notifications.
              </p>
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <Label htmlFor="deletePassword">Confirm password to delete account</Label>
                <Input
                  id="deletePassword"
                  type="password"
                  value={deletePassword}
                  onChange={(event) => setDeletePassword(event.target.value)}
                />
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
                  onClick={handleDeleteAccount}
                  disabled={!isAuthenticated || isDeletingAccount || !deletePassword}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </section>

          <div className="flex gap-4 items-center">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-secondary text-secondary-foreground hover:opacity-90"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
          {savedMessage ? <p className="text-sm text-accent text-center">{savedMessage}</p> : null}
        </div>
      </div>
    </LifeShell>
  );
}
