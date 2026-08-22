<script lang="ts">
    export let fps = 0
    export let dt = 0
</script>

<div class="debug-card">
    <div class="debug-header">Debug</div>

    <div class="stat">
        <span>fps</span>
        <span>{fps.toFixed(1)}</span>
    </div>

    <div class="stat">
        <span>dt</span>
        <span>{(dt * 1000).toFixed(2)} ms</span>
    </div>
</div>

<style>
.debug-card {
    position: fixed;
    top: 20px;
    left: 20px;

    min-width: 180px;
    padding: 14px 16px;

    color: rgba(255, 255, 255, 0.9);

    background: rgba(20, 20, 30, 0.55);
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 14px;

    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);

    box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.35),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);

    font-family:
        Inter,
        system-ui,
        sans-serif;
    font-size: 13px;

    user-select: none;
}

.debug-header {
    display: flex;
    align-items: center;
    gap: 8px;

    margin-bottom: 4px;

    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;

    color: rgba(255, 255, 255, 0.55);
}

.status-dot {
    width: 7px;
    height: 7px;

    border-radius: 50%;
    background: #66ff99;

    box-shadow: 0 0 10px rgba(102, 255, 153, 0.7);
}

.stat {
    display: flex;
    justify-content: space-between;
    gap: 30px;

    padding: 5px 0;
}

.stat span {
    color: rgba(255, 255, 255, 0.5);
}

.stat strong {
    font-variant-numeric: tabular-nums;
    color: rgba(255, 255, 255, 0.9);
}
</style>