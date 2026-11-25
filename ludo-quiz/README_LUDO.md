# Ludo Quiz v1.0.3 — reconstrução Android

O HTML de v1.0.2 foi preservado sem modificação; o código original do tabuleiro é carregado como asset local no WebView. O aplicativo é compilado com Gradle 8.10.2 e Android Gradle Plugin 8.6.1.

Os APKs v1.0.0-v1.0.2 foram montados manualmente; este projeto usa a compilação oficial de Java -> DEX -> APK via SDK Android.

Como a chave de assinatura é distinta, deve ser desinstalada a versão anterior para instalar o novo APK. A versão debug é somente para uso/teste no celular, não para publicação na Play Store.

O fluxo do jogo, ID de elementos HTML, onclick, onchange e dados lógicos não foram alterados. Testes em dispositivo físico são necessários para confirmar que a Activity abre.
