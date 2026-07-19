import React from "react";
import { User, Mail, Phone } from "lucide-react";
import { PropertyUser } from "@/services/properties/properties.service";

interface PropertySellerCardProps {
  user?: PropertyUser;
}

export const PropertySellerCard: React.FC<PropertySellerCardProps> = ({ user }) => {
  if (!user) return null;

  return (
    <div className="bg-card border border-border/80 rounded-xl p-5 shadow-xs space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <User className="h-4 w-4 text-yashomePink" />
        <span>Seller Contact Info</span>
      </h3>
      <div className="space-y-2 text-sm">
        {user.fullName && (
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <User className="h-4 w-4 text-muted-foreground/60 shrink-0" />
            <span>{user.fullName}</span>
          </div>
        )}
        {user.email && (
          <div className="flex items-center gap-2 font-medium text-muted-foreground">
            <Mail className="h-4 w-4 text-muted-foreground/60 shrink-0" />
            <span>{user.email}</span>
          </div>
        )}
        {user.phoneNumber && (
          <div className="flex items-center gap-2 font-medium text-muted-foreground">
            <Phone className="h-4 w-4 text-muted-foreground/60 shrink-0" />
            <span>{user.phoneNumber}</span>
          </div>
        )}
      </div>
    </div>
  );
};
