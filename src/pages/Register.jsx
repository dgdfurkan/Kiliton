import React, { useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { getFirestore, doc, setDoc } from "firebase/firestore";

export default function Register() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const nameRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Şifreler eşleşmiyor.');
    }

    try {
      setError('');
      setLoading(true);
      const userCredential = await signup(emailRef.current.value, passwordRef.current.value, nameRef.current.value);

      // Create user document in Firestore (default role: member, no group yet)
      const db = getFirestore();
      await setDoc(doc(db, "users", userCredential.user.uid), {
        name: nameRef.current.value,
        email: emailRef.current.value,
        role: 'member', // Default role
        groupId: null // Not in a group yet
      });

      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Hesap oluşturulamadı: ' + err.message);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <UserPlus className="text-white" size={24} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Yeni Hesap Oluştur
          </h2>
        </div>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">İsim Soyisim</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                ref={nameRef}
                className="appearance-none rounded-none rounded-t-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="İsim Soyisim"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">E-posta adresi</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                ref={emailRef}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="E-posta adresi"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Şifre</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                ref={passwordRef}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Şifre"
              />
            </div>
            <div>
              <label htmlFor="password-confirm" className="sr-only">Şifre Tekrar</label>
              <input
                id="password-confirm"
                name="password-confirm"
                type="password"
                autoComplete="new-password"
                required
                ref={passwordConfirmRef}
                className="appearance-none rounded-none rounded-b-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Şifre Tekrar"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              Kayıt Ol
            </button>
          </div>

          <div className="text-sm text-center">
            <p className="text-gray-600">
                Zaten hesabınız var mı?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Giriş Yap
                </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
