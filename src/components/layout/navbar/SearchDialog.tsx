
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

export const SearchDialog = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>搜索提示词</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="输入关键词搜索..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
