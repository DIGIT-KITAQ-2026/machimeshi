// Supabase（PostgREST/Auth/Storage）が投げるエラーはJSの`Error`インスタンスではなく、
// `{ message, code, ... }` という形のプレーンオブジェクトであることが多い。
// `err instanceof Error`だけで判定すると、その場合にメッセージを拾えず
// フォールバック文言しか表示されなくなるため、共通のヘルパーで両方に対応する。

export function getErrorMessage(err: unknown, fallback = '不明なエラーが発生しました'): string {
  if (err instanceof Error) return err.message
  if (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as { message: unknown }).message === 'string'
  ) {
    return (err as { message: string }).message
  }
  return fallback
}
