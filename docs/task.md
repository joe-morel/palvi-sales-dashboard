# Tarea técnica — Palvi

---

## 1. El problema

Construir una **aplicación web que sirva como reporte ejecutivo de métricas** de una empresa B2B SaaS, a partir de un único archivo `metrics.json` con datos diarios (tráfico, leads, deals, tiempos de respuesta, tickets de soporte, etc).

### Contexto de uso

El **Jefe de Ventas** abre la página en la mañana. Tiene **5 minutos** antes de su primera reunión. Su trabajo es **aumentar las ventas y mejorar la atención al cliente**, y necesita salir sabiendo **dónde poner foco hoy**.

### Restricción importante

`metrics.json` trae **4 datasets (A, B, C, D)** con la misma estructura pero comportamiento distinto. La app tiene que dejar al usuario navegar entre ellos y **responder correctamente a cada uno** — no solo al primero.

### Filosofía de evaluación

> No hay una solución única. Las decisiones importan más que la cantidad de cosas que se metan.

---

## 2. El dataset

### Estructura

`metrics.json` es un objeto cuyas claves de primer nivel son los datasets (`A`, `B`, `C`, `D`). Cada dataset tiene su propia metadata y serie diaria:

```json
{
  "A": {
    "metadata": {
      "start_date": "2025-04-26",
      "end_date": "2026-04-25",
      "days": 365,
      "metrics": [
        {
          "key": "traffic",
          "label": "Daily visits",
          "unit": "visits",
          "direction": "higher_is_better",
          "description": "Unique visits to the public marketing site."
        }
        // ... resto de las métricas
      ]
    },
    "days": [
      {
        "date": "2025-04-26",
        "metrics": {
          "traffic": 1834,
          "leads_created": 12,
          "avg_response_time_min": 31.2
          // ... resto de las métricas
        }
      }
      // ... 365 días
    ]
  },
  "B": {
    /* misma forma */
  },
  "C": {
    /* misma forma */
  },
  "D": {
    /* misma forma */
  }
}
```

### Notas sobre los datos

- Los 4 datasets comparten la misma lista de métricas en `metadata.metrics`. Lo que cambia es el **comportamiento subyacente**.
- El campo `direction` indica si subir es bueno (`higher_is_better`) o malo (`lower_is_better`). Viene en los datos para no tener que adivinar el dominio.
- **Algunas métricas pueden venir como `null`** en días puntuales (por ejemplo, `avg_response_time_min` cuando no hubo leads ese día). Hay que considerarlo.

---

## 3. Glosario

> No esperan que sepamos vender. Estos son los términos que aparecen en `metrics.json`.

| Término                       | Campo en JSON                                            | Definición                                                                                                                     |
| ----------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Lead**                      | `leads_created`                                          | Persona o empresa que mostró interés (llenó un formulario, agendó demo). Cuenta los nuevos del día.                            |
| **Lead calificado**           | `leads_qualified`                                        | Lead que ventas evaluó y considera prospecto real (fit, presupuesto, timing).                                                  |
| **Deal**                      | `deals_created`                                          | Oportunidad de venta abierta sobre un lead calificado. Cuenta nuevas en el día.                                                |
| **Deal ganado / perdido**     | `deals_won`, `deals_lost`                                | Deals que cerraron hoy con cada resultado.                                                                                     |
| **Tiempo de respuesta**       | `avg_response_time_min`                                  | Minutos desde que llega un lead hasta el primer contacto del equipo de ventas. En B2B, respuestas lentas tumban la conversión. |
| **Deal cycle**                | `avg_deal_cycle_days`                                    | Días entre apertura y cierre. Promedio sobre los deals que cerraron ese día.                                                   |
| **Stale deal**                | `stale_deals`                                            | Deal abierto desde hace **más de 60 días** sin cerrar. Conteo al final del día.                                                |
| **Tasa de cierre / win rate** | _calculado_                                              | `sum(deals_won) / sum(deals_won + deals_lost)`. Métrica **de período** (qué cerró esta semana), no de cohorte.                 |
| **Funnel / embudo**           | _flujo_                                                  | `tráfico → leads → leads calificados → deals → deals ganados`. Cada paso tiene su tasa; un cuello en uno se nota aguas abajo.  |
| **Tickets de soporte**        | `support_tickets_opened`, `support_avg_resolution_hours` | Abiertos hoy y horas promedio para resolverlos.                                                                                |

---

## 4. Stack

- **React + TypeScript** — obligatorio.
- **Lo demás se decide:** librería de UI, charting, estado global, build tool. Cada decisión que se tome interesa.

---

## 5. Sobre el uso de IA

> Esperan que se use IA (Cursor, Claude Code, Copilot, lo que sea). Así trabajan ellos. **No es trampa.**

Lo que se evalúa:

- Cómo se descompuso el problema
- Qué abstracciones se eligieron
- Qué decisiones se tomaron uno mismo vs la IA

---

## 6. Entregable

### 6.1 Repo en GitHub

- Público o invitándolos como colaboradores.
- Instrucciones claras para correrlo localmente.

### 6.2 README corto

**1 página máximo. Solo dos secciones:**

1. **Decisiones técnicas** — qué se eligió y por qué.
2. **Segunda iteración** — qué se dejaría para después y por qué.

### 6.3 Video de máximo 3 minutos

Loom, Tella, YouTube unlisted, Google Drive, lo que sea. **Sin intro, sin edición, sin pulir.** Una toma directa.

| Sección                     | Tiempo | Contenido                                                                                                                                                |
| --------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Demo**                    | 60s    | Cambiar entre dos datasets (A y B, o cualquier par). Mostrar que la app responde diferente entre uno y otro.                                             |
| **Walk-through del código** | 90s    | Abrir el editor. Mostrar el archivo o función donde se decide **cómo presentar cada métrica al usuario**. Explicar brevemente por qué se implementó así. |
| **Lo que se dejó fuera**    | 30s    | Una cosa que se sabe que falta o que se haría distinto, y por qué.                                                                                       |

> Si pasa de 3 minutos no van a alcanzar a verlo completo.

---
