import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Users, BookOpen, Trophy, Star, ArrowLeft, Puzzle, Gamepad2, Sparkles, MessageCircle, PlaySquare, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import KindergartenCurriculumSection from "@/components/KindergartenCurriculumSection";
import RewardsDisplay from "@/components/RewardsDisplay";
import AITutorChat from "@/components/AITutorChat";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const LearningApp = () => {
  const { t } = useTranslation();
  const [isKidLogin, setIsKidLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [kidProfile, setKidProfile] = useState<any>(null);
  const [showAITutor, setShowAITutor] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleKidLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Database query will work once types are regenerated
      const { data, error } = await supabase
        .from('kid_profiles' as any)
        .select('*')
        .eq('username', username)
        .eq('pin', pin)
        .maybeSingle();

      if (error || !data) {
        toast({
          title: t("learningApp.toastLoginFailedTitle"),
          description: t("learningApp.toastLoginFailedDesc"),
          variant: "destructive"
        });
      } else {
        toast({
          title: t("learningApp.toastWelcomeTitle"),
          description: t("learningApp.toastWelcomeDesc", { name: username }),
        });
        // Store the kid profile in session and state
        sessionStorage.setItem('kidProfile', JSON.stringify(data));
        setKidProfile(data);
      }
    } catch (error) {
      toast({
        title: t("learningApp.toastErrorTitle"),
        description: t("learningApp.toastErrorDesc"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchParentAccess = () => {
    // If already logged in, go to parent dashboard, otherwise to auth
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">{t('learningApp.back')}</span>
            </Link>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {t('learningApp.title')}
              </h1>
            </div>
            <div className="flex items-center gap-2">
            {user && (
              <Button onClick={() => navigate('/curriculum-lesson-admin')} variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                {t('learningApp.manageLessons')}
              </Button>
            )}
            <LanguageSwitcher />
            <Button onClick={fetchParentAccess} variant="outline">
              {t('learningApp.parentLogin')}
            </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {kidProfile && (
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">{t('learningApp.welcomeBack', { name: kidProfile.username })}</h2>
              <Button 
                variant="outline" 
                onClick={() => {
                  setKidProfile(null);
                  setIsKidLogin(false);
                  sessionStorage.removeItem('kidProfile');
                }}
              >
                {t('learningApp.logout')}
              </Button>
            </div>
            <RewardsDisplay kidId={kidProfile.id} />
          </div>
        )}
        
        {!isKidLogin && !kidProfile ? (
          <>
            {/* Hero Section */}
            <section className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              {t('learningApp.heroTitle')}
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('learningApp.heroSubtitle')}
            </p>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={() => setIsKidLogin(true)}
                >
                <Star className="w-5 h-5 mr-2" />
                {t('learningApp.kidLogin')}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={fetchParentAccess}
              >
                <Users className="w-5 h-5 mr-2" />
                {t('learningApp.parentAccess')}
              </Button>
              </div>
            </section>

            {/* Features Grid */}
            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <Card 
                className="border-2 border-purple-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate('/story-books')}
              >
                <CardHeader>
                  <BookOpen className="w-12 h-12 text-purple-600 mb-4" />
                  <CardTitle>{t('learningApp.cardStoryBooksTitle')}</CardTitle>
                  <CardDescription>
                    {t('learningApp.cardStoryBooksDesc')}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="border-2 border-pink-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate('/ai-story-creator')}
              >
                <CardHeader>
                  <Sparkles className="w-12 h-12 text-pink-600 mb-4" />
                  <CardTitle>{t('learningApp.cardAiStoryTitle')}</CardTitle>
                  <CardDescription>
                    {t('learningApp.cardAiStoryDesc')}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="border-2 border-green-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate('/puzzle')}
              >
                <CardHeader>
                  <Puzzle className="w-12 h-12 text-green-600 mb-4" />
                  <CardTitle>{t('learningApp.cardPuzzlesTitle')}</CardTitle>
                  <CardDescription>
                    {t('learningApp.cardPuzzlesDesc')}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="border-2 border-orange-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate('/games-library')}
              >
                <CardHeader>
                  <Gamepad2 className="w-12 h-12 text-orange-600 mb-4" />
                  <CardTitle>{t('learningApp.cardGamesLibTitle')}</CardTitle>
                  <CardDescription>
                    {t('learningApp.cardGamesLibDesc')}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="border-2 border-amber-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate('/game-creator')}
              >
                <CardHeader>
                  <Sparkles className="w-12 h-12 text-amber-600 mb-4" />
                  <CardTitle>{t('learningApp.cardCreateAiGameTitle')}</CardTitle>
                  <CardDescription>
                    {t('learningApp.cardCreateAiGameDesc')}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="border-2 border-blue-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setShowAITutor(true)}
              >
                <CardHeader>
                  <MessageCircle className="w-12 h-12 text-blue-600 mb-4" />
                  <CardTitle>{t('learningApp.cardAiTutorTitle')}</CardTitle>
                  <CardDescription>
                    {t('learningApp.cardAiTutorDesc')}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card 
                className="border-2 border-red-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => navigate('/video-learning')}
              >
                <CardHeader>
                  <PlaySquare className="w-12 h-12 text-red-600 mb-4" />
                  <CardTitle>{t('learningApp.cardVideoTitle')}</CardTitle>
                  <CardDescription>
                    {t('learningApp.cardVideoDesc')}
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 border-yellow-200 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
                <CardHeader>
                  <Trophy className="w-12 h-12 text-yellow-600 mb-4" />
                  <CardTitle>{t('learningApp.cardRewardsTitle')}</CardTitle>
                  <CardDescription>
                    {t('learningApp.cardRewardsDesc')}
                  </CardDescription>
                </CardHeader>
              </Card>
            </section>

            {/* Kindergarten Curriculum Section */}
            <KindergartenCurriculumSection />

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 text-white text-center mt-16">
              <h3 className="text-4xl font-bold mb-4">{t('learningApp.ctaTitle')}</h3>
              <p className="text-xl mb-8 opacity-90">
                {t('learningApp.ctaSubtitle')}
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-purple-600 hover:bg-gray-100"
                onClick={() => setIsKidLogin(true)}
              >
                {t('learningApp.ctaButton')}
              </Button>
            </section>
          </>
        ) : (
          /* Kid Login Form */
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-purple-200 bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-3xl">{t('learningApp.formWelcome')}</CardTitle>
                <CardDescription>{t('learningApp.formSubtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleKidLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="username">{t('learningApp.formUsername')}</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={t('learningApp.formPlaceholderUsername')}
                      required
                      className="text-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pin">{t('learningApp.formPin')}</Label>
                    <Input
                      id="pin"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder={t('learningApp.formPlaceholderPin')}
                      required
                      className="text-lg text-center tracking-widest"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    disabled={isLoading}
                  >
                  {isLoading ? t('learningApp.formLoggingIn') : t('learningApp.formLogin')}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setIsKidLogin(false)}
                >
                  {t('learningApp.formBack')}
                </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* AI Tutor Overlay */}
      {showAITutor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl h-[600px] bg-white rounded-lg shadow-2xl">
            <AITutorChat onClose={() => setShowAITutor(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningApp;
