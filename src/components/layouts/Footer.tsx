import React from "react";
import { Link } from "react-router-dom";
import { AllyLogo } from "@/components/atoms/ally-logo";
import { useAnalytics } from "@/hooks/use-analytics";

const Footer: React.FC = () => {
  const { trackButtonClick } = useAnalytics();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 py-8" id="footer">
      <div className="container-ally">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <Link to="/" className="text-ally-dark font-semibold text-xl">
                <AllyLogo />
              </Link>
            </div>
            <p className="text-ally-gray text-sm mt-2">
              A revolução no registro de prontuários médicos.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
            <a
              href="#about"
              className="text-ally-dark hover:text-ally-blue transition-colors"
              onClick={() => trackButtonClick("footer_about")}
            >
              Sobre
            </a>
            <a
              href="#benefits"
              className="text-ally-dark hover:text-ally-blue transition-colors"
              onClick={() => trackButtonClick("footer_benefits")}
            >
              Benefícios
            </a>
            <a
              href="#waitlist"
              className="text-ally-dark hover:text-ally-blue transition-colors"
              onClick={() => trackButtonClick("footer_waitlist")}
            >
              Lista de espera
            </a>
            <Link
              to="/termo-de-uso"
              className="text-ally-dark hover:text-ally-blue transition-colors"
              onClick={() => trackButtonClick("footer_terms")}
            >
              Termos de Uso
            </Link>
            <Link
              to="/politica-privacidade"
              className="text-ally-dark hover:text-ally-blue transition-colors"
              onClick={() => trackButtonClick("footer_privacy")}
            >
              Privacidade
            </Link>
            <a
              href="mailto:contato@allymed.com.br"
              className="text-ally-dark hover:text-ally-blue transition-colors"
              onClick={() => trackButtonClick("footer_contact")}
            >
              Contato
            </a>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-6 pt-6 text-center text-ally-gray text-sm">
          <p>
            © {currentYear} Ally Medical Technologies. Todos os direitos
            reservados.
          </p>
          <p className="mt-1">
            Transformando a prática médica através de tecnologia inteligente.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
