Proyecto Final DOR-DEW se incluye archivo ejemplo de pasos a seguir
Requisitos de finalización
Apertura: jueves, 8 de enero de 2026, 00:00
Cierre: viernes, 9 de enero de 2026, 00:00
🎯 Título del trabajo
“Implementación práctica y análisis funcional de los hooks fundamentales de React en una aplicación web de gestión hotelera”

🧭 Descripción general
El presente trabajo de investigación tiene como objetivo que el alumnado analice, documente y aplique los hooks más relevantes de React para la construcción de una aplicación web interactiva.
A través de la creación de una web simulada de servicios hoteleros, el estudiante deberá comprender el funcionamiento interno de los hooks seleccionados, su propósito dentro del ciclo de vida de los componentes y su impacto en el rendimiento y la mantenibilidad del código.

🧠 Hooks objeto de investigación
useState → Permite gestionar los estados locales de los componentes. Se utilizará para manejar los datos de productos, el carrito de compras y los filtros del catálogo.

El alumnado deberá investigar cómo se inicializa el estado, cómo se actualiza y qué implicaciones tiene su uso en componentes funcionales.

Ejemplo práctico: almacenamiento de la lista de productos o la cantidad de artículos seleccionados.

useMemo → Optimiza el rendimiento del renderizado evitando cálculos innecesarios.

Se aplicará para el ordenamiento de productos (por precio, nombre o categoría), asegurando que los cálculos sólo se realicen cuando cambien las dependencias.

El alumnado deberá analizar el impacto de este hook en la eficiencia de la aplicación y justificar su uso frente a otras alternativas.

useContext / createContext → Facilita la compartición de estado global entre distintos componentes sin necesidad de prop drilling.

Se empleará para gestionar el estado global del carrito de compras, permitiendo acceder y modificar los datos del carrito desde cualquier parte de la aplicación.

El trabajo deberá explicar cómo se crea un contexto, cómo se provee y cómo se consume, además de las ventajas y limitaciones que presenta frente a bibliotecas externas (Redux, Zustand, etc.).

useEffect → Hook del ciclo de vida utilizado para ejecutar efectos secundarios.

Su aplicación será opcional, destinada a guardar o recuperar el carrito de compras desde localStorage, de modo que el estado persista al recargar la página.

El alumnado deberá analizar cuándo se ejecuta un efecto, cómo se define la lista de dependencias y qué precauciones deben tomarse para evitar renderizados infinitos o pérdidas de estado.

🧾 Objetivos específicos
Comprender la función y utilidad de cada hook en el ciclo de vida de una aplicación React.

Aplicar los hooks investigados en un entorno práctico: una web hotelera con catálogo y carrito.

Evaluar la eficiencia, legibilidad y escalabilidad del código con y sin el uso de hooks.

Desarrollar una capacidad crítica para seleccionar el hook adecuado según el tipo de problema.

🧪 Metodología de trabajo
Investigación teórica:

Consulta de la documentación oficial de React y fuentes académicas o técnicas.

Elaboración de un marco conceptual sobre los cuatro hooks seleccionados.

Desarrollo práctico:

Carrito de compras.

Estado global mediante Context.

Integración de los hooks en escenarios concretos del proyecto.

Análisis crítico:

Comparación del rendimiento y la claridad del código antes y después de aplicar los hooks.

Reflexión sobre las ventajas del enfoque funcional frente a clases tradicionales de React.

Conclusiones:

Redacción de un resumen sobre los beneficios y limitaciones de cada hook.

Propuestas de mejora o posibles extensiones futuras (ej. persistencia, API externa, etc.).
