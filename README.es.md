# ng-hub-ui-milestones

**Español** | [English](./README.md)

[![npm version](https://img.shields.io/npm/v/ng-hub-ui-milestones.svg)](https://www.npmjs.com/package/ng-hub-ui-milestones)
[![license](https://img.shields.io/npm/l/ng-hub-ui-milestones.svg)](https://github.com/carlos-morcillo/ng-hub-ui-milestones/blob/main/LICENSE)

Un componente de línea de tiempo / pasos de progreso ligero y presentacional para Angular: distribuye nodos de hitos en vertical u horizontal, proyecta cualquier contenido dentro de cada nodo y personaliza todo mediante variables CSS.

## Documentación y ejemplos en vivo

Este paquete forma parte de [Hub UI](https://hubui.dev/en/), una colección de librerías de componentes Angular para aplicaciones standalone.

- Documentación: https://hubui.dev/en/milestones/overview/
- Ejemplos en vivo: https://hubui.dev/en/milestones/examples/
- Hub UI: https://hubui.dev/en/

## 🧩 Familia de librerías `ng-hub-ui`

Esta librería forma parte del ecosistema **Hub UI**:

- [**ng-hub-ui-accordion**](https://www.npmjs.com/package/ng-hub-ui-accordion) (obsoleta — usa ng-hub-ui-panels)
- [**ng-hub-ui-action-sheet**](https://www.npmjs.com/package/ng-hub-ui-action-sheet)
- [**ng-hub-ui-avatar**](https://www.npmjs.com/package/ng-hub-ui-avatar)
- [**ng-hub-ui-board**](https://www.npmjs.com/package/ng-hub-ui-board)
- [**ng-hub-ui-breadcrumbs**](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs)
- [**ng-hub-ui-calendar**](https://www.npmjs.com/package/ng-hub-ui-calendar)
- [**ng-hub-ui-dropdown**](https://www.npmjs.com/package/ng-hub-ui-dropdown)
- [**ng-hub-ui-ds**](https://www.npmjs.com/package/ng-hub-ui-ds)
- [**ng-hub-ui-forms**](https://www.npmjs.com/package/ng-hub-ui-forms)
- [**ng-hub-ui-history**](https://www.npmjs.com/package/ng-hub-ui-history)
- [**ng-hub-ui-milestones**](https://www.npmjs.com/package/ng-hub-ui-milestones) ← Estás aquí
- [**ng-hub-ui-modal**](https://www.npmjs.com/package/ng-hub-ui-modal)
- [**ng-hub-ui-nav**](https://www.npmjs.com/package/ng-hub-ui-nav)
- [**ng-hub-ui-paginable**](https://www.npmjs.com/package/ng-hub-ui-paginable)
- [**ng-hub-ui-panels**](https://www.npmjs.com/package/ng-hub-ui-panels)
- [**ng-hub-ui-portal**](https://www.npmjs.com/package/ng-hub-ui-portal)
- [**ng-hub-ui-skeleton**](https://www.npmjs.com/package/ng-hub-ui-skeleton)
- [**ng-hub-ui-sortable**](https://www.npmjs.com/package/ng-hub-ui-sortable)
- [**ng-hub-ui-stepper**](https://www.npmjs.com/package/ng-hub-ui-stepper)
- [**ng-hub-ui-utils**](https://www.npmjs.com/package/ng-hub-ui-utils)

## 📑 Tabla de contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Referencia de API](#-referencia-de-api)
- [Estilos](#-estilos)
- [Changelog](#-changelog)
- [Contribuir](#-contribuir)
- [Soporte](#-soporte)
- [Licencia](#-licencia)

## 📖 Descripción

`ng-hub-ui-milestones` renderiza una línea de tiempo (también conocida como pasos de progreso) formada por nodos de hitos conectados por un raíl. Es puramente presentacional y no impone una forma de tus datos: compones la línea de tiempo de manera declarativa con dos componentes y una directiva.

- `hub-milestones` es el contenedor. Distribuye sus nodos hijos en vertical u horizontal, dibuja el raíl de conexión y numera los nodos automáticamente según el orden del DOM.
- `hub-milestone` es un nodo individual. Expone un `state` visual (`complete` · `active` · `pending` · `error`), una sustitución opcional de `color` por nodo y un `label` de respaldo. Cualquier marcado colocado dentro se proyecta como el cuerpo del nodo (título, descripción, fechas, etc.).
- `hubMilestoneNode` es una directiva de atributo para un `<ng-template>` que permite proyectar contenido personalizado **dentro** del círculo del nodo — un número, un icono, un avatar o cualquier marcado. Si se omite, el nodo muestra el `label` o el índice automático en base 1.

Los componentes son standalone, basados en signals, usan detección de cambios `OnPush` y son compatibles con SSR.

## ✨ Características

- **Dos orientaciones**: disposición `vertical` y `horizontal` desde un único input.
- **Numeración automática**: los nodos se numeran (1, 2, 3 …) según el orden del DOM, sin gestión manual.
- **Estados visuales**: los estados `complete`, `active`, `pending` y `error` controlan los colores del nodo y del conector.
- **Contenido de nodo personalizado**: proyecta números, iconos o avatares dentro del círculo mediante `hubMilestoneNode`.
- **Sustitución de color por nodo**: aplica cualquier color CSS a un nodo individual con el input `color`.
- **Animación de revelado al entrar en el viewport**: el trazo de acento «se completa» hasta el nodo activo cuando la línea de tiempo entra en pantalla — **activado por defecto**, configurable globalmente con `provideHubMilestones` o por instancia con `[reveal]`. Compatible con SSR y desactivado bajo `prefers-reduced-motion`.
- **Pulso del nodo activo** (opcional con `[pulse]`): una onda suave sobre el nodo activo para destacar el paso actual.
- **Compatible con RTL**: la disposición, los conectores y la animación de revelado se reflejan correctamente bajo `dir="rtl"`.
- **Personalización completa con variables CSS**: ajusta colores, tamaños, espaciado y los tiempos de animación mediante los tokens `--hub-milestone-*`.
- **Standalone y moderno**: componentes standalone, Angular Signals, `OnPush`, compatible con SSR.
- **Una dependencia adicional**: `ng-hub-ui-utils`, donde vive el resolutor de acentos compartido. Nada más allá de Angular y `tslib`.

## 📦 Instalación

```bash
npm install ng-hub-ui-milestones ng-hub-ui-utils
```

### Peer dependencies

```json
{
	"@angular/common": ">=21.0.0",
	"@angular/core": ">=21.0.0",
	"ng-hub-ui-utils": ">=22.7.0"
}
```

`ng-hub-ui-utils` es **obligatoria** desde la 22.3.0: el input `color` por nodo resuelve su acento con el helper canónico `resolveHubAccent`, que vive ahí. Al instalar la familia con `ng add ng-hub-ui` se añade sola; una instalación manual tiene que nombrarla o la aplicación no resolverá el import al compilar.

## 🚀 Uso

Importa los componentes standalone (y la directiva cuando proyectes contenido de nodo personalizado) en tu componente:

```typescript
import { Component } from '@angular/core';
import { HubMilestonesComponent, HubMilestoneComponent, HubMilestoneNodeDirective } from 'ng-hub-ui-milestones';

@Component({
	selector: 'app-roadmap',
	standalone: true,
	imports: [HubMilestonesComponent, HubMilestoneComponent, HubMilestoneNodeDirective],
	template: `
		<hub-milestones orientation="vertical">
			<hub-milestone state="complete">
				<h4>Inicio del proyecto</h4>
				<p>Requisitos recopilados y aprobados.</p>
			</hub-milestone>

			<hub-milestone state="active">
				<h4>Desarrollo</h4>
				<p>Construyendo las funcionalidades principales.</p>
			</hub-milestone>

			<hub-milestone state="pending">
				<ng-template hubMilestoneNode>★</ng-template>
				<h4>Lanzamiento</h4>
				<p>Despliegue a producción.</p>
			</hub-milestone>
		</hub-milestones>
	`
})
export class RoadmapComponent {}
```

### Orientación horizontal

```html
<hub-milestones orientation="horizontal">
	<hub-milestone state="complete"><h4>Paso 1</h4></hub-milestone>
	<hub-milestone state="active"><h4>Paso 2</h4></hub-milestone>
	<hub-milestone state="pending"><h4>Paso 3</h4></hub-milestone>
</hub-milestones>
```

### El estado sin el color

Un nodo en `error` es el estado que no se puede pasar por alto, y el color solo no basta para
llevarlo. Dos cosas salen automáticas y no piden nada de tu parte:

- **Una marca sobre el círculo**, clara sobre el relleno del propio nodo, para que la diferencia
  sobreviva a la escala de grises y a cualquier forma de daltonismo.
- **El estado como palabra en el cuerpo del nodo**, recortada fuera de la página —un píxel,
  `clip-path`, nada de `display: none`—, así que nunca se ve y siempre se lee junto al paso.

```html
<hub-milestones>
	<hub-milestone state="complete"><h4>Pedido</h4></hub-milestone>

	<!-- Sin marcado extra: la marca y la palabra vienen con el estado -->
	<hub-milestone state="error"><h4>Pago rechazado</h4></hub-milestone>

	<!-- Por nodo, una de las dos formas de traducir la palabra -->
	<hub-milestone state="pending" stateLabel="Pendiente"><h4>Entrega</h4></hub-milestone>
</hub-milestones>
```

Los valores por defecto están en inglés (`Completed`, `Pending`, `Error`, y nada para `active`,
que `aria-current="step"` ya nombra). Para traducirlos una vez en toda la aplicación:

```ts
providers: [
	provideHubMilestones({
		stateLabels: { complete: 'Completado', pending: 'Pendiente', error: 'Error' }
	})
];
```

Cada nodo lleva además `data-state`, el mismo atributo que ya exponen `toast`, `badges` y
`stepper`, por si prefieres seleccionar por ahí en lugar de por la clase modificadora.

### Etiquetas y color por nodo

```html
<hub-milestones orientation="vertical">
	<hub-milestone state="complete" label="A">
		<h4>Fase A</h4>
	</hub-milestone>

	<hub-milestone state="active" color="#0d6efd">
		<h4>Fase B</h4>
	</hub-milestone>

	<hub-milestone state="error">
		<h4>Fase C</h4>
		<p>Algo salió mal aquí.</p>
	</hub-milestone>
</hub-milestones>
```

Cuando un nodo no tiene ni una plantilla `hubMilestoneNode` ni un `label`, recurre a su número automático en base 1.

### Pulso del nodo activo

Añade `[pulse]` al contenedor para emitir una onda suave sobre el nodo `active`, destacando el paso actual. Es opcional y respeta `prefers-reduced-motion`.

```html
<hub-milestones orientation="horizontal" [pulse]="true">
	<hub-milestone state="complete"><h4>Pedido</h4></hub-milestone>
	<hub-milestone state="active"><h4>En tránsito</h4></hub-milestone>
	<hub-milestone state="pending"><h4>Entregado</h4></hub-milestone>
</hub-milestones>
```

### Animación de revelado al entrar en el viewport

Cuando un `<hub-milestones>` entra en pantalla, anima el trazo de acento completándose desde el primer nodo hasta el nodo activo. **Está activada por defecto** — sin configuración. El componente solo anima en el navegador, así que con SSR / sin JS se renderiza el trazo completo, y la animación se desactiva bajo `prefers-reduced-motion`.

Desactívala (o vuelve a activarla) globalmente añadiendo `provideHubMilestones` a la configuración de la aplicación:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHubMilestones } from 'ng-hub-ui-milestones';

export const appConfig: ApplicationConfig = {
	providers: [
		// Desactiva el revelado para todos los <hub-milestones> de la app.
		provideHubMilestones({ reveal: false })
	]
};
```

El input `[reveal]` por instancia siempre prevalece sobre el valor global:

```html
<!-- Fuerza el revelado activado, aunque esté desactivado globalmente -->
<hub-milestones [reveal]="true"> … </hub-milestones>
```

## 📚 Referencia de API

### `HubMilestonesComponent` — `<hub-milestones>`

#### Inputs

| Input         | Tipo                       | Por defecto  | Descripción                                                                                                                                |
| ------------- | -------------------------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `orientation` | `HubMilestonesOrientation` | `'vertical'` | Dirección del diseño: `'vertical'` u `'horizontal'`.                                                                                       |
| `pulse`       | `boolean`                  | `false`      | Emite una onda suave sobre el nodo `active` para destacar el paso actual. Respeta `prefers-reduced-motion`.                                |
| `reveal`      | `boolean`                  | _(global)_   | Reproduce la animación de revelado al entrar en el viewport. Por defecto toma el valor de `provideHubMilestones` (activado si no se fija). |

> El contenedor también numera automáticamente sus nodos `hub-milestone` proyectados según el orden del DOM; no se requiere ningún input para ello.

### `provideHubMilestones(config?)`

Un proveedor de entorno para valores por defecto de toda la aplicación. Añádelo al array `providers` de tu `ApplicationConfig`.

| Opción   | Tipo      | Por defecto | Descripción                                                                                       |
| -------- | --------- | ----------- | ------------------------------------------------------------------------------------------------- |
| `reveal` | `boolean` | `true`      | Valor por defecto de la animación de revelado. Se sobrescribe por instancia con el input `[reveal]`. |
| `stateLabels` | `Partial<Record<HubMilestoneState, string>>` | _(inglés)_ | La palabra con la que se anuncia cada estado. Aquí es donde se traduce; `''` silencia un estado. Se sobrescribe por nodo con `[stateLabel]`. |

### `HubMilestoneComponent` — `<hub-milestone>`

#### Inputs

| Input   | Tipo                | Por defecto | Descripción                                                                                          |
| ------- | ------------------- | ----------- | ---------------------------------------------------------------------------------------------------- |
| `state` | `HubMilestoneState` | `'pending'` | Estado visual: `'complete'` · `'active'` · `'pending'` · `'error'`. Controla los colores del nodo/conector. |
| `color` | `string`            | `''`        | Sustitución de color por nodo (cualquier color CSS). Prevalece sobre el color del estado.            |
| `label` | `string`            | `''`        | Contenido de respaldo mostrado dentro del nodo cuando no se proporciona una plantilla `hubMilestoneNode`. |
| `stateLabel` | `string \| undefined` | _(global)_ | La palabra con la que se anuncia este nodo, por encima de `stateLabels`. `''` la silencia; sin valor, hereda. |

> El contenido proyectado (no de plantilla) colocado dentro de `<hub-milestone>` se renderiza como el cuerpo del nodo, junto (vertical) o debajo (horizontal) del círculo del nodo.

### `HubMilestoneNodeDirective` — `[hubMilestoneNode]`

Directiva de atributo aplicada a un `<ng-template>` para marcar el contenido que se renderiza **dentro** del círculo del nodo (un número, icono, avatar o cualquier marcado). No tiene inputs ni outputs, y no renderiza nada donde se escribe: es `<hub-milestone>` quien recoge la plantilla marcada y la pinta dentro del círculo.

```html
<hub-milestone state="complete">
	<ng-template hubMilestoneNode>✓</ng-template>
	<h4>Hecho</h4>
</hub-milestone>
```

### Tipos y tokens exportados

| Tipo                       | Valores                                          |
| -------------------------- | ------------------------------------------------ |
| `HubMilestonesOrientation` | `'vertical' \| 'horizontal'`                     |
| `HubMilestoneState`        | `'complete' \| 'active' \| 'pending' \| 'error'` |
| `HubMilestonesConfig`      | `{ reveal?: boolean; stateLabels?: Partial<Record<HubMilestoneState, string>> }` |

`HUB_MILESTONES_CONFIG` — el `InjectionToken<HubMilestonesConfig>` que rellena `provideHubMilestones()` — también se exporta. Léelo con `inject(HUB_MILESTONES_CONFIG, { optional: true })` cuando necesites los valores por defecto ya resueltos de la aplicación, o provéelo tú mismo para acotarlos a una parte del árbol.

## 🎨 Estilos

La librería se personaliza por completo mediante variables CSS `--hub-milestone-*`, con valores de respaldo seguros para que funcione de forma autónoma y se re-tematice en tiempo de ejecución. Sobreescríbelas en `:root`, en un selector `hub-milestones` o por nodo mediante el input `color`.

Las tres vías llegan al componente. Los valores por defecto se publican dentro de un bloque `:where(:root)`, cuya especificidad es cero, de modo que cualquier regla que escribas —`:root`, `html`, `hub-milestones`, una clase contenedora— gana sin necesidad de `!important`. Cuanto más cercano el selector, más estrecho el alcance: `:root` re-tematiza todas las líneas de tiempo de la aplicación, `hub-milestones` solo las que coincidan con ese selector, y el input `color`, un único nodo.

| Variable CSS                           | Por defecto                                    | Descripción                                                          |
| -------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------- |
| `--hub-milestone-node-size`            | `2.75rem`                                      | Diámetro del círculo del nodo.                                       |
| `--hub-milestone-node-font-size`       | `1.05rem`                                      | Tamaño de fuente del contenido del nodo.                            |
| `--hub-milestone-node-color`           | `var(--hub-sys-color-primary, #0d6efd)`        | Color de fondo del nodo (completado/activo). También tiñe el trazo. |
| `--hub-milestone-node-text`            | `var(--hub-ref-color-white, #ffffff)`          | Color del texto/contenido del nodo.                                 |
| `--hub-milestone-pending-bg`           | `var(--hub-sys-surface-elevated, #f8f9fa)`     | Fondo de un nodo pendiente.                                         |
| `--hub-milestone-pending-color`        | `var(--hub-sys-text-muted, #6c757d)`           | Color del texto de un nodo pendiente.                              |
| `--hub-milestone-pending-border`       | `var(--hub-sys-border-color-default, #dee2e6)` | Borde de un nodo pendiente.                                        |
| `--hub-milestone-error-bg`             | `var(--hub-sys-color-danger, #dc3545)`         | Fondo de un nodo de error.                                        |
| `--hub-milestone-connector-thickness`  | `3px`                                          | Grosor del raíl de conexión.                                      |
| `--hub-milestone-connector-bg`         | por defecto, `--hub-milestone-node-color`      | Fondo del conector para segmentos completados. Sin fijar, sigue el acento del nodo, incluido un `color` por nodo. |
| `--hub-milestone-connector-pending-bg` | `var(--hub-sys-border-color-default, #dee2e6)` | Fondo del conector que lleva a un nodo pendiente.                 |
| `--hub-milestone-gap`                  | `1rem`                                         | Espacio entre el nodo y su cuerpo.                                |
| `--hub-milestone-spacing`              | `1.75rem`                                      | Espaciado entre hitos consecutivos.                               |
| `--hub-milestone-body-color`           | `var(--hub-sys-text-primary, #212529)`         | Color del texto del cuerpo.                                       |
| `--hub-milestone-body-muted`           | `var(--hub-sys-text-muted, #6c757d)`           | Color atenuado del texto del cuerpo.                              |
| `--hub-milestone-pulse-color`          | `var(--hub-milestone-node-color)`              | Color de la onda de pulso del nodo activo (`[pulse]`).            |
| `--hub-milestone-pulse-duration`       | `1.6s`                                         | Duración de un ciclo de pulso.                                    |
| `--hub-milestone-pulse-spread`         | `0.75rem`                                      | Cuánto se expande la onda de pulso desde el nodo.                |
| `--hub-milestone-reveal-duration`      | `0.5s`                                         | Duración del rellenado de cada conector durante el revelado.     |
| `--hub-milestone-reveal-stagger`       | `0.14s`                                        | Retardo entre el rellenado de conectores consecutivos (cascada). |

Ejemplo de personalización independiente del framework:

```scss
hub-milestones {
	--hub-milestone-node-size: 3rem;
	--hub-milestone-node-color: #2563eb; // también tiñe el trazo del conector
	--hub-milestone-spacing: 2rem;
}
```

Ejemplo de integración con Bootstrap (opcional):

```scss
hub-milestones {
	--hub-milestone-node-color: var(--bs-primary);
	--hub-milestone-error-bg: var(--bs-danger);
	--hub-milestone-pending-bg: var(--bs-secondary-bg);
	--hub-milestone-body-color: var(--bs-body-color);
}
```

### Tematización Sass en una sola llamada

Para proyectos Sass, la librería publica sus hojas de estilo en `ng-hub-ui-milestones/styles`, donde el mixin `hub-milestones-theme()` escribe los tokens `--hub-milestone-*` en un único `@include`. Todos los parámetros son opcionales y valen `null` por defecto, así que solo se emiten los que pases; el resto conserva los valores por defecto del componente.

```scss
@use 'ng-hub-ui-milestones/styles' as *;

.onboarding {
	@include hub-milestones-theme($node-color: var(--hub-sys-color-primary), $connector-thickness: 3px);
}
```

Parámetros disponibles: `$node-color`, `$node-text`, `$node-size`, `$node-font-size`, `$connector-bg`, `$connector-pending-bg`, `$connector-thickness`, `$pending-bg`, `$pending-border`, `$pending-color`, `$error-bg`, `$body-color`, `$body-muted`, `$gap`, `$spacing`.

> Los tokens del componente van en singular (`--hub-milestone-*`) mientras que el paquete y el mixin van en plural (`ng-hub-ui-milestones` / `hub-milestones-theme`).

## 📝 Changelog

Consulta el [CHANGELOG.md](./CHANGELOG.md) completo para ver el historial de versiones.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir cambios importantes antes de enviar un pull request, y sigue el estilo de código y las convenciones existentes.

- Repositorio: https://github.com/carlos-morcillo/ng-hub-ui-milestones
- Issues: https://github.com/carlos-morcillo/ng-hub-ui/issues

## 📞 Soporte

- **Issues**: [GitHub Issues](https://github.com/carlos-morcillo/ng-hub-ui/issues)
- **Autor**: [Carlos Morcillo](https://www.carlosmorcillo.com)

## 📄 Licencia

MIT © [Carlos Morcillo](https://www.carlosmorcillo.com)

---

Hecho con ❤️ por el equipo de Hub UI
