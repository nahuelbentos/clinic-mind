# Prompt Efficiency Guide

Guía para escribir prompts eficientes y minimizar el consumo de tokens en Claude Code.

---

## Por qué los prompts grandes son caros

Cada sesión tiene un límite de contexto. Cuando se agota:
- La sesión se compacta (resumen automático) → pierde precisión
- O la sesión termina y hay que continuar en una nueva con overhead de resumen

**El contexto se consume por:**
- El prompt del usuario (texto + código de ejemplo)
- Cada archivo leído (Read tool)
- Cada archivo escrito completo (Write tool)
- Resultados de Bash commands (especialmente si son largos)
- El resumen de compactación cuando la sesión anterior se cortó

---

## Los 5 principales culpables de consumo excesivo

### 1. Scope masivo en un solo prompt
Pedir migración completa de toda la app, traducir todos los componentes, refactorizar todo el módulo — en una sola sesión.

### 2. Incluir código de ejemplo en el prompt
```
# MAL — esto consume tokens innecesariamente:
"Crea un archivo así:
export function foo() {
  const x = ...
  return ...
}"

# BIEN — referenciar en vez de repetir:
"Crea una función similar a la de src/lib/bar.ts pero para X"
```

### 3. Write en vez de Edit para archivos existentes
- `Write` envía el archivo **completo** al contexto
- `Edit` envía solo el **diff** (mucho más barato)
- Siempre preferir `Edit` para modificaciones parciales

### 4. Leer archivos grandes completos cuando solo se necesita una parte
```
# MAL:
Read("archivo.tsx")  # 500 líneas completas

# BIEN:
Read("archivo.tsx", offset=120, limit=30)  # solo las líneas necesarias
```

### 5. Archivos JSON / de mensajes escritos completos
Archivos como `messages/es.json` con cientos de claves, escritos de una sola vez, son muy costosos.

---

## Estrategias de optimización

### Dividir en sesiones focalizadas

En vez de un prompt con 10 tareas, hacer sesiones temáticas:

```
Sesión 1: Setup e infraestructura (config files, schema, middleware)
Sesión 2: Lógica de negocio (actions, auth, API)
Sesión 3: Componentes UI (components, forms)
Sesión 4: Páginas (pages, layouts)
Sesión 5: Build + fixes
```

### No incluir código en el prompt — referenciar archivos

```
# MAL:
"Actualiza el componente para que use useTranslations así:
const t = useTranslations('nav')
return <div>{t('home')}</div>
..."

# BIEN:
"Actualiza todos los componentes en src/components/ para usar
useTranslations() de next-intl. Los namespaces están en messages/es.json."
```

### Usar subagentes para trabajo paralelo

Para tareas independientes, delegar a subagentes protege el contexto principal:
```
# En vez de leer 15 archivos en el contexto principal,
# usar un agente Explore que tiene su propio contexto
```

### Ser específico en vez de "todo"

```
# MAL (scope abierto):
"Traduce todos los strings hardcodeados en la app"

# BIEN (scope cerrado):
"Traduce los strings hardcodeados en estos 3 archivos:
- src/components/dashboard/StatusChanger.tsx
- src/components/dashboard/DeletePatientButton.tsx
- src/components/dashboard/NewAppointmentForm.tsx"
```

### Usar Grep/Glob en vez de Read para exploración

```
# MAL — consume el archivo completo:
Read("src/components/BigComponent.tsx")

# BIEN — solo encuentra lo que necesita:
Grep("useTranslations", "src/components/")
```

---

## Checklist antes de enviar un prompt complejo

- [ ] ¿El scope afecta más de 10 archivos? → Dividir en sesiones
- [ ] ¿El prompt tiene más de 200 palabras? → Simplificar y referenciar
- [ ] ¿Incluye bloques de código como ejemplo? → Reemplazar por referencias a archivos
- [ ] ¿Es una migración / traducción / refactor "de toda la app"? → Dividir por módulo
- [ ] ¿Las subtareas son independientes entre sí? → Considerar subagentes paralelos

---

## Template para tareas grandes

En vez de un prompt monolítico, usar este patrón:

```
OBJETIVO: [qué se quiere lograr en esta sesión]
SCOPE: [archivos o módulos específicos — NO "toda la app"]
CONTEXTO: [referencias a archivos relevantes, no código copiado]
RESTRICCIONES: [qué NO tocar]
ENTREGABLE: [cómo saber que está hecho]
```

Ejemplo:
```
OBJETIVO: Agregar traducción i18n al módulo de admin
SCOPE: src/app/[locale]/admin/ y src/components/admin/
CONTEXTO: El setup de next-intl ya está en src/i18n/.
          Las keys de admin están en messages/es.json bajo "admin"
RESTRICCIONES: No tocar el middleware ni auth
ENTREGABLE: npm run build sin errores de TypeScript
```

---

## Señales de alerta en un prompt

Si el prompt contiene alguna de estas combinaciones, considerar dividirlo:

| Señal | Riesgo |
|-------|--------|
| "toda la app" / "todos los componentes" | Alto |
| Más de 5 archivos a modificar | Medio-Alto |
| Migración + refactor + build en un solo prompt | Muy alto |
| Ejemplos de código > 20 líneas en el prompt | Medio |
| Tarea que requiere leer > 15 archivos | Alto |
| Prompt > 300 palabras | Medio-Alto |

---

## Cuándo SÍ usar un prompt grande

- Tareas con muchas dependencias entre sí (no se pueden separar)
- Cuando el contexto compartido es crítico para la coherencia
- Bugs complejos que requieren entender varios módulos a la vez

En esos casos, usar `/check-prompt` para analizar el scope antes de empezar.
