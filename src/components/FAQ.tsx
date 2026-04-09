'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, ChevronRight } from 'lucide-react'

const faqData = [
  {
    question: "Não tenho entrada, consigo construir?",
    answer: "A entrada é um requisito fundamental para viabilizar o financiamento bancário e garantir a saúde financeira da sua obra. No entanto, o valor exato depende do seu perfil e do projeto escolhido. Nossa consultoria ajuda você a entender qual o montante necessário e como se preparar para esse passo."
  },
  {
    question: "Ainda não tenho terreno, por onde começo?",
    answer: "Excelente! Começar pelo projeto ou pela consultoria antes de comprar o terreno é o caminho mais seguro. Ajudamos você a definir o perfil de casa que deseja para que, na hora de buscar o terreno, você saiba exatamente se ele comporta o seu sonho, evitando gastos extras com terraplanagem ou muros de arrimo desnecessários."
  },
  {
    question: "Consigo usar meu FGTS na construção?",
    answer: "Sim, é possível utilizar o saldo do seu FGTS tanto na aquisição do terreno quanto na construção da sua casa, desde que as regras do Fundo sejam respeitadas. Durante nossa análise inicial, verificamos seu saldo e como ele pode ser aplicado para abater o valor da entrada ou das parcelas."
  },
  {
    question: "Como funciona a consultoria do Mauro?",
    answer: "Diferente de uma construtora comum, eu atuo como seu braço direito técnico. Analiso seu cenário financeiro, seu terreno e suas necessidades familiares para indicar o projeto certo e os parceiros (arquitetos e construtores) ideais. O objetivo é clareza total: você saberá exatamente o que está comprando e quanto vai custar, antes de assinar qualquer contrato."
  },
  {
    question: "Tenho medo de custos inesperados. Como ter previsibilidade?",
    answer: "O medo de 'obra que nunca acaba ou que o orçamento dobra' é real quando não há planejamento. Com nossa análise de viabilidade, trabalhamos com orçamentos detalhados e cronogramas realistas. Você terá clareza técnica sobre cada etapa, eliminando surpresas e garantindo que o valor planejado seja respeitado."
  },
  {
    question: "Quais tipos de projetos vocês atendem?",
    answer: "Focamos em projetos que aliam design moderno e eficiência construtiva. Nosso portfólio inclui desde casas térreas inteligentes até sobrados de alto padrão e projetos para investidores (geminadas). Cada projeto é selecionado para garantir valorização patrimonial e conforto térmico/acústico."
  },
  {
    question: "Já tenho o terreno, qual o próximo passo?",
    answer: "O próximo passo é a nossa Análise Consultiva. Vamos avaliar as medidas do seu terreno, a topografia e o zoneamento local para cruzar com o projeto que você deseja. Preencha o formulário abaixo para iniciarmos essa orientação técnica e transformarmos seu terreno em uma residência de alto padrão."
  }
]

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <section className="w-full py-24 bg-brand-black border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
            <HelpCircle size={14} /> Dúvidas Frequentes
          </div>
          <h2 className="text-[22px] md:text-[32px] font-serif text-white font-medium tracking-tight mb-4">
            Respostas para sua Segurança
          </h2>
          <div className="w-24 h-1.5 bg-brand-gold rounded-full mx-auto"></div>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div 
              key={index}
              className={`border rounded-2xl transition-all duration-300 ${activeIndex === index ? 'bg-brand-dark border-brand-gold/30 shadow-[0_10px_30px_rgba(0,0,0,0.3)]' : 'bg-brand-dark/40 border-white/5 hover:border-white/10'}`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none"
              >
                <span className={`text-base md:text-lg font-medium transition-colors ${activeIndex === index ? 'text-brand-gold' : 'text-zinc-200'}`}>
                  {item.question}
                </span>
                <ChevronDown 
                  className={`shrink-0 transition-transform duration-300 ${activeIndex === index ? 'rotate-180 text-brand-gold' : 'text-zinc-500'}`} 
                  size={20} 
                />
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-8 md:px-8 md:pb-10 pt-0 text-zinc-400 leading-relaxed font-light text-base border-t border-white/5 mx-6 md:mx-8">
                      <div className="pt-6">
                        {item.answer}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-brand-gold/5 border border-brand-gold/20 rounded-3xl text-center">
          <p className="text-zinc-300 font-light mb-6">Ainda tem alguma dúvida específica sobre o seu cenário?</p>
          <a 
            href="#contato" 
            className="inline-flex items-center gap-2 text-brand-gold hover:text-white font-black text-xs uppercase tracking-widest transition-colors"
          >
            Fale diretamente comigo <ChevronRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
