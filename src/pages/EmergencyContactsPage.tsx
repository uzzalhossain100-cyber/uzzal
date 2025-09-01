import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, PhoneCall, Siren, Ambulance, Hospital, MessageSquareText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmergencyContact {
  service: string;
  number: string;
  description: string;
  icon: React.ElementType;
}

const emergencyContacts: EmergencyContact[] = [
  {
    service: "জাতীয় জরুরি সেবা",
    number: "999",
    description: "পুলিশ, ফায়ার সার্ভিস, অ্যাম্বুলেন্স",
    icon: Siren,
  },
  {
    service: "অ্যাম্বুলেন্স সেবা",
    number: "102",
    description: "সরকারি অ্যাম্বুলেন্স",
    icon: Ambulance,
  },
  {
    service: "ফায়ার সার্ভিস",
    number: "16163",
    description: "ফায়ার সার্ভিস ও সিভিল ডিফেন্স",
    icon: Siren,
  },
  {
    service: "স্বাস্থ্য বাতায়ন",
    number: "16263",
    description: "স্বাস্থ্য সংক্রান্ত তথ্য ও পরামর্শ",
    icon: Hospital,
  },
  {
    service: "নারী ও শিশু নির্যাতন প্রতিরোধ",
    number: "109",
    description: "নারী ও শিশু নির্যাতন প্রতিরোধে হেল্পলাইন",
    icon: MessageSquareText,
  },
  {
    service: "জাতীয় পরিচয়পত্র (NID)",
    number: "105",
    description: "জাতীয় পরিচয়পত্র সংক্রান্ত তথ্য",
    icon: PhoneCall,
  },
  {
    service: "দুর্নীতি দমন কমিশন (দুদক)",
    number: "106",
    description: "দুর্নীতি সংক্রান্ত অভিযোগ",
    icon: PhoneCall,
  },
  {
    service: "কৃষি কল সেন্টার",
    number: "16123",
    description: "কৃষি সংক্রান্ত তথ্য ও পরামর্শ",
    icon: PhoneCall,
  },
  {
    service: "ভূমি সেবা",
    number: "16122",
    description: "ভূমি সংক্রান্ত তথ্য ও সেবা",
    icon: PhoneCall,
  },
  {
    service: "প্রবাসী কল্যাণ হেল্পলাইন",
    number: "16135",
    description: "প্রবাসী কর্মীদের জন্য সহায়তা",
    icon: PhoneCall,
  },
];

const EmergencyContactsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to the previous page (Index page showing categories)
  };

  return (
    <div className="min-h-screen flex flex-col h-full bg-transparent"> {/* Changed bg-gray-100 to bg-transparent */}
      <Card className="w-full flex flex-col flex-1 shadow-lg border-primary/20 dark:border-primary/50">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <CardTitle className="text-3xl font-extrabold text-primary dark:text-primary-foreground flex items-center">
            <Button variant="ghost" onClick={handleBack} className="p-0 h-auto mr-2 text-primary dark:text-primary-foreground hover:bg-transparent hover:text-primary/80">
              <ArrowLeft className="h-6 w-6" />
            </Button>
            জরুরি যোগাযোগ
          </CardTitle>
          <CardDescription className="text-muted-foreground hidden sm:block">বাংলাদেশের জরুরি প্রয়োজনে যোগাযোগের নম্বরসমূহ</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-130px)] w-full p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>সেবা</TableHead>
                  <TableHead>নম্বর</TableHead>
                  <TableHead className="hidden md:table-cell">বিবরণ</TableHead>
                  <TableHead className="text-right">কল করুন</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emergencyContacts.map((contact, index) => {
                  const Icon = contact.icon;
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <Icon className="h-5 w-5 text-primary" />
                      </TableCell>
                      <TableCell className="font-medium">{contact.service}</TableCell>
                      <TableCell>{contact.number}</TableCell>
                      <TableCell className="text-muted-foreground hidden md:table-cell">{contact.description}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`tel:${contact.number}`)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <PhoneCall className="h-4 w-4 mr-2" /> কল
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyContactsPage;