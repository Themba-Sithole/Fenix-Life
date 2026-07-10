import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { ArrowLeft, Volume2, Monitor, Gamepad2, Globe, Bell, Lock, Cloud, Sun } from "lucide-react";
import { API_URL, checkApiHealth } from "@/lib/api";

export default function Settings() {
  const navigate = useNavigate();
  const [apiOnline, setApiOnline] = useState<boolean | null>(null);

  useEffect(() => {
    checkApiHealth().then(setApiOnline);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-white to-[#F5F7FA] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Menu
          </Button>
          <div>
            <h1 className="text-3xl text-[#1C2541]">Settings</h1>
            <p className="text-gray-600">Customize your experience</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Graphics Settings */}
          <Card className="border-[#2EC4B6]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541] flex items-center gap-2">
                <Monitor className="w-5 h-5 text-[#2EC4B6]" />
                Graphics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#1C2541]">Quality</div>
                  <div className="text-sm text-gray-600">Adjust visual quality</div>
                </div>
                <Select defaultValue="high">
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
                  <div className="text-[#1C2541]">Fullscreen</div>
                  <div className="text-sm text-gray-600">Enable fullscreen mode</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#1C2541]">V-Sync</div>
                  <div className="text-sm text-gray-600">Synchronize frame rate</div>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Audio Settings */}
          <Card className="border-[#F4B400]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541] flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-[#F4B400]" />
                Audio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[#1C2541]">Master Volume</div>
                  <div className="text-sm text-gray-600">80%</div>
                </div>
                <Slider defaultValue={[80]} max={100} step={1} />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[#1C2541]">Music Volume</div>
                  <div className="text-sm text-gray-600">60%</div>
                </div>
                <Slider defaultValue={[60]} max={100} step={1} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[#1C2541]">Effects Volume</div>
                  <div className="text-sm text-gray-600">70%</div>
                </div>
                <Slider defaultValue={[70]} max={100} step={1} />
              </div>
            </CardContent>
          </Card>

          {/* Gameplay Settings */}
          <Card className="border-[#2EC4B6]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541] flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-[#2EC4B6]" />
                Gameplay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#1C2541]">Difficulty</div>
                  <div className="text-sm text-gray-600">Game difficulty level</div>
                </div>
                <Select defaultValue="normal">
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
                  <div className="text-[#1C2541]">Autosave</div>
                  <div className="text-sm text-gray-600">Automatically save progress</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#1C2541]">Tutorial Hints</div>
                  <div className="text-sm text-gray-600">Show helpful tips</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* General Settings */}
          <Card className="border-[#2EC4B6]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541] flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#2EC4B6]" />
                General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#1C2541]">Language</div>
                  <div className="text-sm text-gray-600">Select language</div>
                </div>
                <Select defaultValue="en">
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
                  <div className="text-[#1C2541] flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notifications
                  </div>
                  <div className="text-sm text-gray-600">Enable game notifications</div>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#1C2541] flex items-center gap-2">
                    <Cloud className="w-4 h-4" />
                    Cloud Saves
                  </div>
                  <div className="text-sm text-gray-600">
                    API: {API_URL}
                    {apiOnline === null && " — checking…"}
                    {apiOnline === true && " — connected"}
                    {apiOnline === false && " — offline (run api locally or deploy)"}
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Account */}
          <Card className="border-[#1C2541]/20 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#1C2541] flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#1C2541]" />
                Privacy & Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Manage Account
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Privacy Settings
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
                Delete Account
              </Button>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-[#2EC4B6] to-[#1C9B8F] text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
