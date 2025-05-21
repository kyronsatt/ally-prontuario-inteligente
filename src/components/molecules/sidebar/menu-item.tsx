
import React from "react";
import { NavLink } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface SidebarMenuItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  iconSize?: number;
  end?: boolean;
}

const SidebarMenuItemComponent: React.FC<SidebarMenuItemProps> = ({
  to,
  icon: Icon,
  label,
  iconSize = 24,
  end = false,
}) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <NavLink
          to={to}
          className={({ isActive }) =>
            isActive ? "text-ally-blue" : "text-muted-foreground"
          }
          end={end}
        >
          <Icon size={iconSize} />
          <span>{label}</span>
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default SidebarMenuItemComponent;
