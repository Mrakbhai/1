
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Star } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail: string;
  userName: string;
}

export function OnboardingFlow({ isOpen, onClose, userId, userEmail, userName }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [emailPrefs, setEmailPrefs] = useState({
    updates: false,
    marketing: false,
    courseUpdates: false
  });
  const { setTheme } = useTheme();
  
  const handleSaveUsername = async () => {
    if (!username.trim()) return;
    
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      username,
      displayName: userName
    });
    setStep(2);
  };

  const handleSaveEmailPrefs = async () => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      emailPreferences: emailPrefs
    });
    setStep(3);
  };

  const handleSaveTheme = async (selectedTheme: string) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      theme: selectedTheme
    });
    setTheme(selectedTheme);
  };

  const handleComplete = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] transition-all duration-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {step === 1 ? 'Choose Your Username' : 
             step === 2 ? 'Email Preferences' : 
             'Select Your Theme'}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-slideIn">
              <Input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button 
                className="w-full bg-primary-gradient"
                onClick={handleSaveUsername}
                disabled={!username.trim()}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-slideIn">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-updates">Receive email updates</Label>
                  <Switch
                    id="email-updates"
                    checked={emailPrefs.updates}
                    onCheckedChange={(checked) => 
                      setEmailPrefs(prev => ({ ...prev, updates: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="marketing">Receive marketing emails</Label>
                  <Switch
                    id="marketing"
                    checked={emailPrefs.marketing}
                    onCheckedChange={(checked) => 
                      setEmailPrefs(prev => ({ ...prev, marketing: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="course-updates">Get course update emails</Label>
                  <Switch
                    id="course-updates"
                    checked={emailPrefs.courseUpdates}
                    onCheckedChange={(checked) => 
                      setEmailPrefs(prev => ({ ...prev, courseUpdates: checked }))}
                  />
                </div>
              </div>
              <Button 
                className="w-full bg-primary-gradient"
                onClick={handleSaveEmailPrefs}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-slideIn">
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="p-4 aspect-square"
                  onClick={() => handleSaveTheme('light')}
                >
                  <Sun className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  className="p-4 aspect-square"
                  onClick={() => handleSaveTheme('dark')}
                >
                  <Moon className="h-6 w-6" />
                </Button>
                <Button
                  variant="outline"
                  className="p-4 aspect-square"
                  onClick={() => handleSaveTheme('luxury')}
                >
                  <Star className="h-6 w-6" />
                </Button>
              </div>
              <Button 
                className="w-full bg-primary-gradient"
                onClick={handleComplete}
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
