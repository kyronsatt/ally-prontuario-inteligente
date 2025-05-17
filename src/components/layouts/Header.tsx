
import React, { useState, useEffect } from "react";
import { AllyLogo } from "@/components/atoms/ally-logo";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
        scrolled ? "bg-white/95 backdrop-blur-xl py-2 shadow-sm" : "bg-transparent py-4"
      )}
    >
      <div className="container-ally flex justify-between items-center">
        <a href="/" className="text-ally-dark font-semibold text-xl z-10">
          <AllyLogo />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLink href="#about">Sobre</NavLink>
          <NavLink href="#benefits">Benefícios</NavLink>
          <NavLink href="#pricing">Lista de espera</NavLink>
          <a href="/login">
            <Button>Entrar</Button>
          </a>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu size={22} />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col h-full py-6">
              <div className="flex items-center justify-between mb-8">
                <AllyLogo />
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <X size={22} />
                      <span className="sr-only">Fechar</span>
                    </Button>
                  </SheetTrigger>
                </Sheet>
              </div>
              <nav className="flex flex-col space-y-4">
                <MobileNavLink href="#about">Sobre</MobileNavLink>
                <MobileNavLink href="#benefits">Benefícios</MobileNavLink>
                <MobileNavLink href="#pricing">Lista de espera</MobileNavLink>
                <a href="/login" className="mt-4">
                  <Button className="w-full">Entrar</Button>
                </a>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
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

const MobileNavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="text-lg font-medium text-ally-dark py-2 hover:text-ally-blue transition-colors"
    >
      {children}
    </a>
  );
};

export default Header;
