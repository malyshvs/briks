import LoginForm from "../components/Auth/LoginForm";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-[#0b1023] flex justify-center items-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
