import { useState } from "react";

import reactLogo from "@/assets/react.svg";

export default function App({ name = "world" }: { name?: string }) {
  const [count, setCount] = useState(0);

  return (
    <div className="pt-32 text-center">
      <div className="mb-3 flex justify-center space-x-12">
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img
            src="/vite.svg"
            className="w-48 hover:opacity-50"
            alt="Vite logo"
          />
        </a>
        <a href="https://reactjs.org" target="_blank" rel="noreferrer">
          <img
            src={reactLogo}
            className="w-48 hover:opacity-50"
            alt="React logo"
          />
        </a>
      </div>
      <h1 className="text-2xl">Hello {name}</h1>
      <div className="card mx-auto my-3 w-96 bg-base-200">
        <div className="card-body">
          <button
            className="btn-primary btn"
            type="button"
            onClick={() => setCount((c) => c + 1)}
          >
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}
