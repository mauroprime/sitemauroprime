@echo off
chcp 65001 > nul
echo ===================================================
echo INSTALACAO DO PROJETO NEXT.JS E DEPENDENCIAS
echo ===================================================

echo.
echo 1. Criando o projeto Next.js...
call npx -y create-next-app@latest ./ --typescript --tailwind --app --eslint --src-dir --no-import-alias --use-npm

echo.
echo 2. Instalando dependencias do Supabase e UI...
call npm install @supabase/supabase-js @supabase/ssr zod react-hook-form @hookform/resolvers framer-motion yet-another-react-lightbox react-markdown sharp lucide-react

echo.
echo 3. Iniciando shadcn/ui (responda Yes/Enter para as perguntas padrão, se houver)...
call npx shadcn@latest init

echo.
echo 4. Adicionando componentes do shadcn/ui...
call npx shadcn@latest add button input label textarea select table badge tabs card toast dialog

echo.
echo ===================================================
echo CONCLUIDO!
echo Por favor, volte para mim e diga que terminou para que eu possa configurar as variaveis e o middleware.
echo ===================================================
pause
