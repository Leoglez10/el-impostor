# 🕵️ El Impostor
<p align="center">
  Juego web multijugador inspirado en la dinámica social de deducción y traición.
Los jugadores deben colaborar para completar tareas mientras intentan descubrir quién es el impostor… antes de que sea demasiado tarde.
</p>



<table>
  <tr>
    <td>
       <img width="565" height="875" alt="image" src="https://github.com/user-attachments/assets/03a26fa0-1907-4839-8a69-b95dd4aa3f14" />
    </td>
    <td>
      <img width="578" height="871" alt="image" src="https://github.com/user-attachments/assets/9acf3403-703b-4fb5-a580-97f994186150" />
    </td>
  </tr>
</table>





<p align="center">
  🔗 Demo en vivo:  
https://el-impostor-839098521388.us-west1.run.app/
</p>

---

## 🎮 ¿De qué trata?

- Juego multijugador en tiempo real
- Sistema de roles (Tripulante / Impostor)
- Interacción entre jugadores
- Lógica de victoria basada en eliminación o cumplimiento de objetivos

El enfoque principal del proyecto fue implementar la sincronización en tiempo real y la gestión de estado entre múltiples clientes conectados simultáneamente.

---

## 🧠 Objetivo del Proyecto

Este proyecto lo desarrollé para:

- Practicar arquitectura cliente-servidor
- Implementar comunicación en tiempo real
- Gestionar estados compartidos
- Desplegar una aplicación full-stack en producción

Más que el juego en sí, el reto fue la lógica detrás del multijugador.

---

## 🛠️ Tecnologías Utilizadas

- Frontend: (Aquí pon lo que usaste)
- Backend: (Node, Express, WebSockets, etc.)
- Base de datos: (si aplica)
- Deploy: Google Cloud Run

---

## ⚙️ Arquitectura

- Cliente renderiza estado del juego
- Servidor mantiene la fuente de verdad
- Eventos sincronizados en tiempo real
- Manejo de desconexiones y reinicios de partida

---

## 🚀 Cómo ejecutarlo localmente

```bash
git clone https://github.com/Leoglez10/el-impostor
cd el-impostor
npm install
npm run dev
