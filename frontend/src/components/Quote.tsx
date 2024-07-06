const Quote = () => {
  return (
    <div className="bg-slate-100 h-screen flex justify-center items-center flex-col">
      <div className="flex flex-col items-left">
        <div className="max-w-lg text-left text-3xl font-bold mb-4">
          "The only way to do great work is to love what you do. If you haven't
          found it yet, keep looking. Don't settle."
        </div>
        <div className="max-w-md text-left text-xl font-semibold">
          Steve Jobs
        </div>
        <div className="max-w-md text-slate-600 text-left text-lg">
          Co-founder of Apple Inc.
        </div>
      </div>
    </div>
  );
};

export default Quote;
