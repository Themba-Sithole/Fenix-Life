import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, GraduationCap, Users, Briefcase } from "lucide-react";
import AvatarSelector from "../components/AvatarSelector";
import { useSave } from "@/context/SaveContext";
import {
  COUNTRIES,
  CURRENCIES,
  createBankingForBackground,
  deriveYoungAdultStartDate,
  encodeWorldSeed,
  formatMoney,
  getCitiesForCountry,
  getDefaultCurrencyForCountry,
  lifePathLabel,
  totalNetWorthCents,
  type LifePath,
} from "@fenix/domain";

export default function CharacterCreation() {
  const navigate = useNavigate();
  const { createNewSave } = useSave();
  const [selectedBackground, setSelectedBackground] = useState("middle-class");
  const [selectedLifePath, setSelectedLifePath] = useState<LifePath>("undecided");
  const [selectedAvatar, setSelectedAvatar] = useState("professional");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nationality, setNationality] = useState("US");
  const [residenceCountry, setResidenceCountry] = useState("US");
  const [cityId, setCityId] = useState("us-washington-d-c");
  const [currency, setCurrency] = useState("USD");
  const [gender, setGender] = useState("male");
  const [birthday, setBirthday] = useState("1982-06-15");
  const [skinTone, setSkinTone] = useState("medium");
  const [hairstyle, setHairstyle] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cities = useMemo(() => getCitiesForCountry(residenceCountry), [residenceCountry]);
  const youngAdultStartDate = useMemo(() => deriveYoungAdultStartDate(birthday), [birthday]);

  useEffect(() => {
    const nextCities = getCitiesForCountry(residenceCountry);
    const nextCurrency = getDefaultCurrencyForCountry(residenceCountry);
    setCurrency(nextCurrency);
    setCityId(nextCities[0]?.id ?? "");
  }, [residenceCountry]);

  function startingCashForBackground(backgroundId: string): string {
    return formatMoney(
      totalNetWorthCents(createBankingForBackground(backgroundId)),
      currency,
    );
  }

  const backgrounds = useMemo(
    () => [
    {
      id: "wealthy",
      name: "Wealthy Family",
      startingCash: startingCashForBackground("wealthy"),
      education: "Private School",
      relationships: "Excellent",
      connections: "High Society",
      advantages: ["Trust Fund", "Business Contacts", "Premium Education"],
      disadvantages: ["High Expectations", "Pressure"],
      difficulty: "Standard",
      difficultyColor: "text-fenix-gold",
    },
    {
      id: "middle-class",
      name: "Middle Class",
      startingCash: startingCashForBackground("middle-class"),
      education: "Public School",
      relationships: "Good",
      connections: "Community",
      advantages: ["Stable Family", "Good Education", "Support Network"],
      disadvantages: ["Limited Capital", "Average Connections"],
      difficulty: "Normal",
      difficultyColor: "text-fenix-gold",
    },
    {
      id: "working-class",
      name: "Working Class",
      startingCash: startingCashForBackground("working-class"),
      education: "Public School",
      relationships: "Strong",
      connections: "Local",
      advantages: ["Strong Work Ethic", "Resilience", "Street Smart"],
      disadvantages: ["Limited Resources", "Few Connections"],
      difficulty: "Hard",
      difficultyColor: "text-orange-400",
    },
    {
      id: "orphan",
      name: "Orphan",
      startingCash: startingCashForBackground("orphan"),
      education: "Basic",
      relationships: "None",
      connections: "None",
      advantages: ["Independence", "Determination", "Self-Reliant"],
      disadvantages: ["No Support", "No Resources", "Alone"],
      difficulty: "Very Hard",
      difficultyColor: "text-red-400",
    },
    {
      id: "immigrant",
      name: "Immigrant",
      startingCash: startingCashForBackground("immigrant"),
      education: "Variable",
      relationships: "Family Abroad",
      connections: "Community",
      advantages: ["Multilingual", "Cultural Insight", "Hungry for Success"],
      disadvantages: ["Language Barrier", "Limited Local Network"],
      difficulty: "Hard",
      difficultyColor: "text-orange-400",
    },
    {
      id: "entrepreneur-family",
      name: "Entrepreneur Family",
      startingCash: startingCashForBackground("entrepreneur-family"),
      education: "Business School",
      relationships: "Business Network",
      connections: "Industry Leaders",
      advantages: ["Business Knowledge", "Mentorship", "Startup Capital"],
      disadvantages: ["Following in Footsteps", "Comparison Pressure"],
      difficulty: "Normal",
      difficultyColor: "text-fenix-gold",
    },
  ],
    [currency],
  );

  const lifePaths = useMemo(
    () =>
      ([
        "undecided",
        "business-founder",
        "corporate-ladder",
        "market-wizard",
        "family-first",
        "free-spirit",
      ] as LifePath[]).map((path) => ({
        id: path,
        label: lifePathLabel(path),
        hint:
          path === "business-founder"
            ? "Highlights company founding and banking"
            : path === "corporate-ladder"
              ? "Highlights education and career paths"
              : path === "market-wizard"
                ? "Highlights stocks and investing"
                : path === "family-first"
                  ? "Highlights family and legacy systems"
                  : path === "free-spirit"
                    ? "Highlights city exploration and news"
                    : "No suggested focus — choose your own way",
      })),
    [],
  );

  async function handleStartJourney() {
    const name = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ') || 'My Life';
    if (!cityId) {
      setError('Please select a starting city');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await createNewSave({
        name,
        worldSeed: encodeWorldSeed({
          background: selectedBackground,
          avatar: selectedAvatar,
          nationalityCode: nationality,
          countryCode: residenceCountry,
          cityId,
          currency,
          gender,
          birthday,
          skinTone,
          hairstyle,
          lifePath: selectedLifePath,
        }),
      });
      navigate('/childhood-play');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create save');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-life-atmosphere px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>

        <section className="border-y border-border py-8">
          <header className="mb-8">
            <p className="text-xs font-medium tracking-[0.16em] text-fenix-gold">A NEW LIFE</p>
            <h1 className="mt-2 font-display text-3xl text-fenix-navy">Create your character</h1>
            <p className="mt-2 text-muted-foreground">Choose who you were born as. Your story begins at 18.</p>
            <p className="mt-4 border-l-2 border-fenix-emerald bg-fenix-emerald/5 px-4 py-3 text-sm text-fenix-navy">
              Born {birthday} → start {youngAdultStartDate} at age 18
            </p>
          </header>
          <div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-xl text-secondary mb-4">Personal Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    className="border-accent/30"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    className="border-accent/30"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="border-accent/30">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <Input id="birthday" type="date" className="border-accent/30" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                    <p className="text-xs text-fenix-emerald">
                      Born {birthday} → start {youngAdultStartDate} at age 18
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality (Citizenship)</Label>
                  <Select value={nationality} onValueChange={setNationality}>
                    <SelectTrigger className="border-accent/30">
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[280px]">
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="residence">Country You Live In</Label>
                  <Select value={residenceCountry} onValueChange={setResidenceCountry}>
                    <SelectTrigger className="border-accent/30">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[280px]">
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Your starting city and default currency follow the country you live in.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Starting City</Label>
                  <Select value={cityId} onValueChange={setCityId} disabled={cities.length === 0}>
                    <SelectTrigger className="border-accent/30">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[280px]">
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                          {city.isCapital ? " (Capital)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="border-accent/30">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[280px]">
                      {CURRENCIES.map((item) => (
                        <SelectItem key={item.code} value={item.code}>
                          {item.code} — {item.name} ({item.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Defaults to {getDefaultCurrencyForCountry(residenceCountry)} for your residence country. You can change it.
                  </p>
                </div>

                <div className="pt-4 border-t border-accent/20">
                  <h4 className="mb-3 text-secondary">Appearance</h4>
                  
                  <div className="mb-4">
                    <AvatarSelector 
                      selectedAvatar={selectedAvatar}
                      onSelect={setSelectedAvatar}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Select value={skinTone} onValueChange={setSkinTone}>
                      <SelectTrigger className="border-accent/30">
                        <SelectValue placeholder="Skin Tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={hairstyle} onValueChange={setHairstyle}>
                      <SelectTrigger className="border-accent/30">
                        <SelectValue placeholder="Hairstyle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="long">Long</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl text-secondary mb-4">Choose Your Background</h3>
                
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {backgrounds.map((bg) => (
                    <Card
                      key={bg.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        selectedBackground === bg.id
                          ? 'border-fenix-emerald bg-fenix-emerald/5'
                          : 'border-gray-200 hover:border-accent/50'
                      }`}
                      onClick={() => setSelectedBackground(bg.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-secondary">{bg.name}</h4>
                          <Badge className={`${bg.difficultyColor} bg-transparent border`}>
                            {bg.difficulty}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-accent" />
                            <span className="text-gray-600">Cash:</span>
                            <span className="text-accent">{bg.startingCash}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-fenix-gold" />
                            <span className="text-gray-600">{bg.education}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-accent" />
                            <span className="text-gray-600">{bg.relationships}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-fenix-gold" />
                            <span className="text-gray-600">{bg.connections}</span>
                          </div>
                        </div>

                        {selectedBackground === bg.id && (
                          <div className="pt-3 border-t border-accent/20">
                            <div className="mb-2">
                              <div className="text-xs text-gray-500 mb-1">Advantages:</div>
                              <div className="flex flex-wrap gap-1">
                                {bg.advantages.map((adv, i) => (
                                  <Badge key={i} variant="outline" className="text-xs bg-accent/10 text-accent border-accent/30">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    {adv}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Disadvantages:</div>
                              <div className="flex flex-wrap gap-1">
                                {bg.disadvantages.map((dis, i) => (
                                  <Badge key={i} variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200">
                                    <TrendingDown className="w-3 h-3 mr-1" />
                                    {dis}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-accent/20">
              <h3 className="text-xl text-secondary mb-2">Suggested Path (Optional)</h3>
              <p className="text-sm text-gray-500 mb-4">
                UX hints only — any path is achievable from any background (GDD §6.3).
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {lifePaths.map((path) => (
                  <Card
                    key={path.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedLifePath === path.id
                        ? "border-accent bg-accent/5 shadow-md"
                        : "border-gray-200 hover:border-accent/50"
                    }`}
                    onClick={() => setSelectedLifePath(path.id)}
                  >
                    <CardContent className="p-4">
                      <h4 className="text-secondary font-medium mb-1">{path.label}</h4>
                      <p className="text-xs text-gray-500">{path.hint}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-8 pt-6 border-t border-accent/20">
              {error && (
                <p className="text-sm text-red-600 self-center mr-4">{error}</p>
              )}
              <Button variant="outline" onClick={() => navigate("/")} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                onClick={handleStartJourney}
                disabled={isSubmitting || !cityId}
                className="bg-primary px-8 text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? 'Creating save…' : 'Start Your Journey'}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
