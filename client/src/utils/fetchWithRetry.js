// Retries a fetch across Render free-tier cold starts. Retries on network
// errors and 5xx responses, aborting each attempt after `timeoutMs` so a
// hanging cold-start request is retried quickly instead of blocking on the
// gateway timeout. Honors an external abort signal (e.g. component unmount)
// passed via options.signal.
export async function fetchWithRetry(
  url,
  options = {},
  { retries = 5, delayMs = 3000, timeoutMs = 20000, onRetry } = {}
) {
  const externalSignal = options.signal;

  for (let attempt = 1; attempt <= retries; attempt++) {
    if (externalSignal?.aborted) throw new DOMException('Aborted', 'AbortError');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const onAbort = () => controller.abort();
    externalSignal?.addEventListener('abort', onAbort, { once: true });

    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timer);
      externalSignal?.removeEventListener('abort', onAbort);
      // Return immediately for success or any non-5xx (caller reads data.error).
      if (res.ok || res.status < 500 || attempt === retries) return res;
      onRetry?.(attempt, retries);
      await new Promise((r) => setTimeout(r, delayMs));
    } catch (err) {
      clearTimeout(timer);
      externalSignal?.removeEventListener('abort', onAbort);
      // Real unmount/cancel — surface as AbortError so callers can ignore it.
      if (externalSignal?.aborted) throw new DOMException('Aborted', 'AbortError');
      if (attempt === retries) throw err;
      onRetry?.(attempt, retries);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}
