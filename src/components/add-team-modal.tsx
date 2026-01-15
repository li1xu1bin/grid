"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { characters } from "@/lib/characters";
import type { Character, Team } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  score: z.coerce.number().min(0, "分数必须为非负数。"),
  chains: z.record(z.string(), z.coerce.number().min(0).max(6)).default({}),
});

interface AddTeamModalProps {
  children: React.ReactNode;
  onAddTeam: (team: Team) => void;
}

export function AddTeamModal({ children, onAddTeam }: AddTeamModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      score: 0,
      chains: {},
    },
  });

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
      setSelectedCharacters([]);
    }
    setOpen(isOpen);
  };
  
  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacters((prev) => {
      const isSelected = prev.find((c) => c.id === character.id);
      if (isSelected) {
        return prev.filter((c) => c.id !== character.id);
      }
      if (prev.length < 3) {
        return [...prev, character];
      }
      toast({
        title: "已达到选择上限",
        description: "最多只能选择3个角色。",
        variant: "destructive",
      });
      return prev;
    });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (selectedCharacters.length !== 3) {
      toast({
        title: "选择无效",
        description: "请选择3个角色。",
        variant: "destructive",
      });
      return;
    }

    const newTeam: Team = {
      id: new Date().toISOString(),
      score: values.score,
      members: selectedCharacters.map((char) => ({
        character: char,
        chain: values.chains[char.id] ?? 0,
      })),
    };
    
    onAddTeam(newTeam);
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-card">
        <DialogHeader>
          <DialogTitle>添加新记录</DialogTitle>
          <DialogDescription>
            选择3个角色，设置他们的链数，并输入队伍分数。
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>深塔分数</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="例如：2220" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">已选角色 ({selectedCharacters.length}/3)</h3>
              <p className="text-sm text-muted-foreground">选择角色配置 (点击头像更换)</p>
              {selectedCharacters.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {selectedCharacters.map((char) => (
                    <FormField
                      key={char.id}
                      control={form.control}
                      name={`chains.${char.id}`}
                      defaultValue={0}
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-center space-y-2">
                          <Image
                            src={char.avatarUrl}
                            alt={char.name}
                            width={64}
                            height={64}
                            className="rounded-full object-cover"
                            data-ai-hint="character portrait"
                          />
                          <p className="text-sm font-semibold">{char.name}</p>
                          <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="链" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                                <SelectItem key={i} value={String(i)}>
                                  {i}链
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              ) : (
                 <p className="text-sm text-muted-foreground">从下面的列表中选择角色。</p>
              )}
            </div>

            <div className="space-y-2">
               <h3 className="text-lg font-medium">可用角色</h3>
                <ScrollArea className="h-48">
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 p-2">
                      {characters.map((char) => {
                          const isSelected = selectedCharacters.some((c) => c.id === char.id);
                          return (
                              <button
                                  type="button"
                                  key={char.id}
                                  onClick={() => handleSelectCharacter(char)}
                                  className={cn(
                                      "flex flex-col items-center space-y-1 rounded-lg p-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-accent",
                                      isSelected ? "bg-primary/50 ring-2 ring-accent" : "hover:bg-secondary",
                                      selectedCharacters.length >= 3 && !isSelected && "opacity-50 cursor-not-allowed"
                                  )}
                                  disabled={selectedCharacters.length >= 3 && !isSelected}
                                  >
                                  <Image
                                      src={char.avatarUrl}
                                      alt={char.name}
                                      width={56}
                                      height={56}
                                      className="rounded-full object-cover"
                                      data-ai-hint="character portrait"
                                  />
                                  <span className="text-xs text-center truncate w-full">{char.name}</span>
                              </button>
                          );
                      })}
                  </div>
                </ScrollArea>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
                取消
              </Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">保存</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
