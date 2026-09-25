import { useState } from "react";


function App() {

  const [message, setMessage] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("File size must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        setMessage(data);
        return;
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = "Immverse_QA.xlsx";

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Backend unavailable:", error);
      alert("Server is not running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center px-4 py-12 font-sans md:pt-44">

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-xs text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          AI Document Processing
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Multilingual Question-Answer
        </h1>

        <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-400">
          Generation System
        </h2>

        <p className="mt-5 text-sm text-zinc-500">
          Upload an English document and generate Q&A in
          <span className="text-zinc-300"> English, Hindi, and Marathi.</span>
        </p>
      </div>


      {/* Upload Card */}
      <div className="w-full max-w-xl">

        <label
          className={`
            group relative w-full min-h-[280px]
            flex flex-col items-center justify-center
            rounded-2xl
            border border-dashed
            bg-zinc-950/70
            transition-all duration-300
            ${
              loading
                ? "cursor-not-allowed border-zinc-800 opacity-70"
                : "cursor-pointer border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/70"
            }
          `}
        >

          {loading ? (
            <>
              {/* Loading */}
              <div className="relative mb-6">
                <div className="w-14 h-14 rounded-full border-4 border-zinc-800 border-t-white animate-spin" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs">AI</span>
                </div>
              </div>

              <p className="text-base font-medium">
                Processing document
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Generating multilingual questions and answers...
              </p>
            </>
          ) : (
            <>
              {/* Upload Icon */}
              <div className="
                w-14 h-14 mb-5
                flex items-center justify-center
                rounded-xl
                bg-zinc-900
                border border-zinc-800
                transition-all duration-300
                group-hover:border-zinc-600
                group-hover:bg-zinc-800
              ">
                <svg
                  className="w-6 h-6 text-zinc-400 group-hover:text-white transition"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                    d="M12 16V4m0 0L8 8m4-4 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
                  />
                </svg>
              </div>

              <p className="text-base font-medium">
                Upload your document
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Click to browse or select a file
              </p>

              {/* Supported formats */}
              <div className="flex items-center gap-2 mt-5">
                {["PDF", "DOC", "DOCX", "TXT"].map((type) => (
                  <span
                    key={type}
                    className="
                      px-2.5 py-1
                      rounded-md
                      bg-zinc-900
                      border border-zinc-800
                      text-[11px]
                      text-zinc-400
                    "
                  >
                    {type}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-xs text-zinc-600">
                Maximum file size: 5 MB
              </p>
            </>
          )}

          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            disabled={loading}
          />

        </label>


        {/* Result */}
        {(message.filename || message.message || message.error) && (
          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950 p-4">

            {message.filename && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center">
                  📄
                </div>

                <div>
                  <p className="text-sm font-medium text-white">
                    {message.filename}
                  </p>

                  {message.message && (
                    <p className="mt-1 text-xs text-emerald-400">
                      {message.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {message.error && (
              <div className="flex gap-3 text-sm text-red-400">
                <span>⚠</span>
                <p>{message.error}</p>
              </div>
            )}

          </div>
        )}
      </div>


      {/* Footer */}
      <div className="mt-12 text-center">
        <p className="text-xs text-zinc-600">
          Submitted by
        </p>

        <p className="mt-1 text-sm text-zinc-400">
          Sarang Khandate
        </p>
      </div>

    </div>
  )
}

export default App
