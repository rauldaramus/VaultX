'use client';
import {
  FileText,
  Archive,
  Lock,
  ShieldCheck,
  Clock,
  LinkIcon,
  EyeOff,
  KeyRound,
  UploadCloud,
} from 'lucide-react';
import { useState } from 'react';
import type React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Switch } from '@/shared/components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import { Textarea } from '@/shared/components/ui/textarea';

export function CreateSecretForm() {
  const [secretContent, setSecretContent] = useState('');
  const [expiresIn, setExpiresIn] = useState('24');
  const [destroyAfterReading, setDestroyAfterReading] = useState(true);
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const expirationOptions: { [key: string]: string } = {
    '1': '1 hour',
    '24': '24 hours',
    '168': '7 days',
    '720': '30 days',
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <Card className="border-border/60 hover-lift animate-fade-in-up opacity-0">
      <CardHeader
        className="flex-row items-start gap-4 space-y-0 animate-fade-in-left opacity-0"
        style={{ animationDelay: '0.1s' }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted transition-all duration-300 hover:bg-primary/20 hover:scale-110">
          <Lock className="h-5 w-5 text-muted-foreground transition-colors duration-200 hover:text-primary" />
        </div>
        <div>
          <CardTitle className="transition-colors duration-200 hover:text-primary">
            Create a Secret
          </CardTitle>
          <CardDescription className="transition-colors duration-200 hover:text-foreground">
            Your secret will be encrypted and only visible once.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          className="space-y-2 animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.2s' }}
        >
          <Label
            htmlFor="title"
            className="flex items-center gap-2 transition-colors duration-200 hover:text-primary"
          >
            <FileText className="h-4 w-4 text-muted-foreground transition-all duration-300 hover:scale-110" />
            Secret Title
          </Label>
          <Input
            id="title"
            placeholder="Enter a descriptive title..."
            className="transition-all duration-300 focus:scale-105 hover:border-primary/50"
          />
          <p className="text-xs text-muted-foreground transition-colors duration-200 hover:text-foreground">
            A clear title will help identify this secret later.
          </p>
        </div>

        <div
          className="animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.3s' }}
        >
          <Tabs defaultValue="text">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="text"
                className="transition-all duration-300 hover:scale-105"
              >
                <FileText className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
                Text
              </TabsTrigger>
              <TabsTrigger
                value="file"
                className="transition-all duration-300 hover:scale-105"
              >
                <Archive className="mr-2 h-4 w-4 transition-transform duration-200 hover:scale-110" />
                File
              </TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="mt-4">
              <div className="relative">
                <Textarea
                  placeholder="Write or paste your secret here..."
                  className="min-h-[120px] resize-none pr-10 transition-all duration-300 focus:scale-105 hover:border-primary/50"
                  value={secretContent}
                  onChange={e => setSecretContent(e.target.value)}
                />
                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground transition-all duration-300 hover:scale-110 animate-pulse-slow" />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="transition-colors duration-200 hover:text-foreground">
                  {secretContent.length} characters
                </span>
                <span className="flex items-center gap-1 transition-colors duration-200 hover:text-foreground">
                  <ShieldCheck className="h-3 w-3 text-green-500 transition-all duration-300 hover:scale-125" />
                  AES-256 Encrypted
                </span>
              </div>
            </TabsContent>
            <TabsContent value="file">
              <div className="space-y-4">
                <Label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center h-[120px] rounded-md border-2 border-dashed cursor-pointer bg-muted/20 hover:bg-muted/30 transition-all duration-300 hover:scale-105 hover:border-primary/50"
                >
                  <UploadCloud className="h-8 w-8 text-muted-foreground transition-all duration-300 hover:scale-110" />
                  <p className="text-sm text-muted-foreground mt-2 transition-colors duration-200 hover:text-foreground">
                    {selectedFile
                      ? selectedFile.name
                      : 'Drag and drop a file here or click to select'}
                  </p>
                  <Input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </Label>
                {selectedFile && (
                  <p className="text-xs text-muted-foreground text-center transition-colors duration-200 hover:text-foreground animate-fade-in-up">
                    Selected file: {selectedFile.name} (
                    {(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div
          className="animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.4s' }}
        >
          <Accordion type="single" collapsible>
            <AccordionItem value="security-options">
              <AccordionTrigger className="text-sm font-medium transition-colors duration-200 hover:text-primary">
                Security Options
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pt-4">
                <div
                  className="space-y-2 animate-fade-in-left opacity-0"
                  style={{ animationDelay: '0.5s' }}
                >
                  <Label
                    htmlFor="expires-in"
                    className="transition-colors duration-200 hover:text-primary"
                  >
                    Expires after
                  </Label>
                  <Select value={expiresIn} onValueChange={setExpiresIn}>
                    <SelectTrigger
                      id="expires-in"
                      className="transition-all duration-300 hover:border-primary/50"
                    >
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(expirationOptions).map(
                        ([value, label]) => (
                          <SelectItem
                            key={value}
                            value={value}
                            className="transition-colors duration-200 hover:bg-primary/10"
                          >
                            {label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div
                  className="flex items-center justify-between animate-fade-in-left opacity-0"
                  style={{ animationDelay: '0.6s' }}
                >
                  <div>
                    <Label
                      htmlFor="password-protected"
                      className="flex items-center gap-2 transition-colors duration-200 hover:text-primary"
                    >
                      <KeyRound className="h-4 w-4 text-muted-foreground transition-all duration-300 hover:scale-110" />
                      Password Protected
                    </Label>
                    <p className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground">
                      The recipient will need a password to view the secret.
                    </p>
                  </div>
                  <Switch
                    id="password-protected"
                    checked={passwordProtected}
                    onCheckedChange={setPasswordProtected}
                    className="transition-all duration-300 hover:scale-110"
                  />
                </div>
                {passwordProtected && (
                  <div className="space-y-2 pl-6 animate-fade-in-up">
                    <Input
                      type="password"
                      placeholder="Enter password"
                      className="transition-all duration-300 focus:scale-105 hover:border-primary/50"
                    />
                  </div>
                )}
                <div
                  className="flex items-center justify-between animate-fade-in-left opacity-0"
                  style={{ animationDelay: '0.7s' }}
                >
                  <div>
                    <Label
                      htmlFor="destroy-after-reading"
                      className="flex items-center gap-2 transition-colors duration-200 hover:text-primary"
                    >
                      <EyeOff className="h-4 w-4 text-muted-foreground transition-all duration-300 hover:scale-110" />
                      Destroy After Reading
                    </Label>
                    <p className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground">
                      The secret will be permanently deleted after being viewed.
                    </p>
                  </div>
                  <Switch
                    id="destroy-after-reading"
                    checked={destroyAfterReading}
                    onCheckedChange={setDestroyAfterReading}
                    className="transition-all duration-300 hover:scale-110"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
      <CardFooter
        className="flex flex-wrap items-center justify-between gap-2 rounded-b-lg bg-muted/50 px-6 py-4 transition-all duration-300 hover:bg-muted/70 animate-fade-in-up opacity-0"
        style={{ animationDelay: '0.8s' }}
      >
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {destroyAfterReading && (
            <div className="flex items-center gap-1.5 transition-colors duration-200 hover:text-foreground">
              <EyeOff className="h-3.5 w-3.5 transition-all duration-300 hover:scale-110" />
              <span>Auto-destruction</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 transition-colors duration-200 hover:text-foreground">
            <Clock className="h-3.5 w-3.5 transition-all duration-300 hover:scale-110" />
            <span>{expirationOptions[expiresIn]}</span>
          </div>
        </div>
        <Button className="transition-all duration-300 hover:scale-105 hover-glow">
          <LinkIcon className="mr-2 h-4 w-4 transition-transform duration-300 hover:scale-110" />
          Create Secret Link
        </Button>
      </CardFooter>
    </Card>
  );
}
