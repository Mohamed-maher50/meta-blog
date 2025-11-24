import { JSX } from "react";
interface DisplayChunkProps<T, B> {
  fetcher: () => Promise<T>;
  render: (data: T) => JSX.Element;
  errorMessage: (error: B) => JSX.Element;
}
const DisplayChunk = async <T, B>({
  fetcher,
  render,
  errorMessage,
}: DisplayChunkProps<T, B>) => {
  try {
    const d = await fetcher();
    return render(d);
  } catch (error) {
    return errorMessage(error as B);
  }
};

export default DisplayChunk;
