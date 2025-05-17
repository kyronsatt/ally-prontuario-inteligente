import React, { useState, useEffect } from "react";
import { AllyLogo } from "@/components/atoms/ally-logo";
import { LucideMenu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  // Detect when the page is scrolled to add/remove background class
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        scrolled ? "bg-white/50 backdrop-blur-xl py-2" : "bg-transparent py-4"
      )}
    >
      <div className="container-ally flex justify-between items-center">
        <a href="/" className="text-ally-dark font-semibold text-xl">
          <AllyLogo />
        </a>

        <nav className="hidden md:flex items-center space-x-6">
          <NavLink href="#about">Sobre</NavLink>
          <NavLink href="#benefits">Benefícios</NavLink>
          <NavLink href="#pricing">Lista de espera</NavLink>
          <a href="/login">
            <Button>Entrar</Button>
          </a>
        </nav>

        <button className="md:hidden text-ally-dark">
          <LucideMenu size={18} />
        </button>
      </div>
    </header>
  );
};

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="text-ally-dark hover:text-ally-blue transition-colors"
    >
      {children}
    </a>
  );
};

export default Header;
