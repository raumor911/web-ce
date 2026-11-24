<?php
namespace Ce\Telemetry\Crawler;

/** Destino de la importación. Abstraído para poder probar el importador sin base de datos. */
interface RecordSink
{
    /** Bloqueo de exclusión por fuente (GET_LOCK). false si otra importación está en curso. */
    public function tryLock($sourceId);

    public function unlock($sourceId);

    /** @return array cursor: ['generations' => [gid => ['offset' => int, 'done' => bool]]] */
    public function loadCursor($sourceId);

    /**
     * Escribe filas y checkpoint de forma ATÓMICA (misma transacción): o entran ambos o ninguno.
     * @param array $rows   filas de crawler_requests (con source_record_key binario)
     * @param array $dates  fechas locales (Y-m-d) afectadas, para marcar agregados por reconstruir
     * @return array ['inserted' => n, 'duplicate' => n]
     */
    public function writeBatch($sourceId, array $rows, array $cursor, array $dates, $lastRequestAt);
}
