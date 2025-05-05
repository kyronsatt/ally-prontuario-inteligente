import React, { useState, useEffect } from "react";
import { AllyLogo } from "./atoms/ally-logo";

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  // Detecta quando a página é rolada para adicionar/remover classe de fundo
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container-ally flex justify-between items-center">
        <a href="#" className="text-ally-dark font-semibold text-xl">
          <AllyLogo />
        </a>

        <nav className="hidden md:flex items-center space-x-6">
          <a
            href="#about"
            className="text-ally-dark hover:text-ally-blue transition-colors"
          >
            Sobre
          </a>
          <a
            href="#benefits"
            className="text-ally-dark hover:text-ally-blue transition-colors"
          >
            Benefícios
          </a>
          <a
            href="#waitlist"
            className="text-ally-dark hover:text-ally-blue transition-colors"
          >
            Lista de espera
          </a>
          <a href="/login" className="btn-primary">
            Entrar
          </a>
        </nav>

        <button className="md:hidden text-ally-dark">
          {/* Menu mobile (omitido para simplicidade) */}
          <span>≡</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
