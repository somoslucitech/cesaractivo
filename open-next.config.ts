import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import kvIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
import d1NextTagCache from "@opennextjs/cloudflare/overrides/tag-cache/d1-next-tag-cache";
import memoryQueue from "@opennextjs/cloudflare/overrides/queue/memory-queue";

// Paginas estaticas guardadas en KV (R2 pide activar facturacion en la cuenta
// del cliente), revalidatePath registrado en D1 y regeneracion por tiempo en
// el propio Worker. enableCacheInterception sirve la pagina guardada sin
// cargar Next: es lo que baja el CPU de cada visita a pocos ms.
export default defineCloudflareConfig({
  incrementalCache: kvIncrementalCache,
  tagCache: d1NextTagCache,
  queue: memoryQueue,
  enableCacheInterception: true,
});
