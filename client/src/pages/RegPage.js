import RegisterForm from "../components/Auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#0b1023] flex justify-center items-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
