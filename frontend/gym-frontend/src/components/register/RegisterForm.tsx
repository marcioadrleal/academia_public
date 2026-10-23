import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  buscarCep,
} from "../../services/cepService";

import {
  registerUser,
} from "../../services/userService";

import type {
  RegisterRequest,
} from "../../types/register";

import "../../styles/register/register-form.css";

interface FormData {
  nome: string;
  email: string;
  dataNascimento: string;
  sexo: string;

  userName: string;
  password: string;
  confirmPassword: string;

  celular: string;
  telefone: string;

  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}

const initialForm: FormData = {
  nome: "",
  email: "",
  dataNascimento: "",
  sexo: "",

  userName: "",
  password: "",
  confirmPassword: "",

  celular: "",
  telefone: "",

  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
};

function onlyNumbers(
  value: string,
) {
  return value.replace(/\D/g, "");
}

function formatCep(
  value: string,
) {
  const numbers =
    onlyNumbers(value).slice(0, 8);

  return numbers.replace(
    /^(\d{5})(\d)/,
    "$1-$2",
  );
}

function formatCellPhone(
  value: string,
) {
  const numbers =
    onlyNumbers(value).slice(0, 11);

  if (numbers.length <= 2) {
    return numbers;
  }

  if (numbers.length <= 3) {
    return `${numbers.slice(0, 2)} ${numbers.slice(2)}`;
  }

  if (numbers.length <= 7) {
    return `${numbers.slice(0, 2)} ${numbers.slice(2, 3)} ${numbers.slice(3)}`;
  }

  return (
    `${numbers.slice(0, 2)} ` +
    `${numbers.slice(2, 3)} ` +
    `${numbers.slice(3, 7)}-` +
    `${numbers.slice(7)}`
  );
}

function formatPhone(
  value: string,
) {
  const numbers =
    onlyNumbers(value).slice(0, 10);

  if (numbers.length <= 2) {
    return numbers;
  }

  if (numbers.length <= 6) {
    return (
      `${numbers.slice(0, 2)} ` +
      `${numbers.slice(2)}`
    );
  }

  return (
    `${numbers.slice(0, 2)} ` +
    `${numbers.slice(2, 6)}-` +
    `${numbers.slice(6)}`
  );
}

export function RegisterForm() {

  const navigate =
    useNavigate();

  const [form, setForm] =
    useState<FormData>(initialForm);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [searchingCep, setSearchingCep] =
    useState(false);

  const [error, setError] =
    useState("");

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement
    >,
  ) {

    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleCelular(
    event:
      React.ChangeEvent<HTMLInputElement>,
  ) {

    setForm((current) => ({
      ...current,
      celular:
        formatCellPhone(
          event.target.value,
        ),
    }));
  }

  function handleTelefone(
    event:
      React.ChangeEvent<HTMLInputElement>,
  ) {

    setForm((current) => ({
      ...current,
      telefone:
        formatPhone(
          event.target.value,
        ),
    }));
  }

  function handleCep(
    event:
      React.ChangeEvent<HTMLInputElement>,
  ) {

    setForm((current) => ({
      ...current,
      cep:
        formatCep(
          event.target.value,
        ),
    }));
  }

  async function handleCepBlur() {

    const cep =
      onlyNumbers(form.cep);

    if (cep.length !== 8) {
      return;
    }

    try {

      setSearchingCep(true);
      setError("");

      const address =
        await buscarCep(cep);

      if (address.erro) {

        setError(
          "CEP não encontrado.",
        );

        return;
      }

      setForm((current) => ({
        ...current,

        cep:
          formatCep(
            address.cep,
          ),

        logradouro:
          address.logradouro ?? "",

        complemento:
          current.complemento ||
          address.complemento ||
          "",

        bairro:
          address.bairro ?? "",

        cidade:
          address.localidade ?? "",

        uf:
          address.uf ?? "",
      }));

    } catch {

      setError(
        "Não foi possível consultar o CEP.",
      );

    } finally {

      setSearchingCep(false);
    }
  }

  function validate(): boolean {

    const camposObrigatorios = [
      {
        campo: form.nome,
        nome: "Nome completo",
      },
      {
        campo: form.email,
        nome: "E-mail",
      },
      {
        campo: form.dataNascimento,
        nome: "Data de nascimento",
      },
      {
        campo: form.sexo,
        nome: "Sexo",
      },
      {
        campo: form.celular,
        nome: "Celular",
      },
      {
        campo: form.cep,
        nome: "CEP",
      },
      {
        campo: form.logradouro,
        nome: "Logradouro",
      },
      {
        campo: form.numero,
        nome: "Número",
      },
      {
        campo: form.bairro,
        nome: "Bairro",
      },
      {
        campo: form.cidade,
        nome: "Cidade",
      },
      {
        campo: form.uf,
        nome: "UF",
      },
      {
        campo: form.userName,
        nome: "Usuário",
      },
      {
        campo: form.password,
        nome: "Senha",
      },
      {
        campo: form.confirmPassword,
        nome: "Confirmação da senha",
      },
    ];

    const camposNaoPreenchidos =
      camposObrigatorios
        .filter(
          (item) =>
            !item.campo ||
            item.campo.trim() === "",
        )
        .map(
          (item) => item.nome,
        );

    if (camposNaoPreenchidos.length > 0) {

      setError(
        `Preencha os campos obrigatórios: ${camposNaoPreenchidos.join(", ")}.`,
      );

      return false;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {

      setError(
        "As senhas informadas não conferem.",
      );

      return false;
    }

    if (
      onlyNumbers(form.celular).length !== 11
    ) {

      setError(
        "Informe um celular válido.",
      );

      return false;
    }

    if (
      form.telefone &&
      onlyNumbers(form.telefone).length !== 10
    ) {

      setError(
        "Informe um telefone válido.",
      );

      return false;
    }

    if (
      onlyNumbers(form.cep).length !== 8
    ) {

      setError(
        "Informe um CEP válido.",
      );

      return false;
    }

    return true;
  }

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault();

    setError("");

    if (!validate()) {
      return;
    }

    const request:
      RegisterRequest = {

      newUser: {
        userName:
          form.userName.trim(),

        password:
          form.password,
      },

      dataPerson: {

        nome:
          form.nome
            .trim()
            .toUpperCase(),

        email:
          form.email
            .trim()
            .toLowerCase(),

        dataNascimento:
          form.dataNascimento,

        sexo:
          form.sexo,

        telefone:
          onlyNumbers(
            form.telefone,
          ),

        celular:
          onlyNumbers(
            form.celular,
          ),

        cep:
          onlyNumbers(
            form.cep,
          ),

        logradouro:
          form.logradouro.trim(),

        numero:
          form.numero.trim(),

        complemento:
          form.complemento.trim(),

        bairro:
          form.bairro.trim(),

        cidade:
          form.cidade.trim(),

        uf:
          form.uf
            .trim()
            .toUpperCase(),
      },
    };

    try {

      setLoading(true);

      const response =
        await registerUser(
          request,
        );

      navigate(
        "/cadastro/sucesso",
        {
          state: response,
        },
      );

    } catch (err) {

      console.error(
        "Erro ao criar conta:",
        err,
      );

      if (err instanceof Error) {

        setError(
          err.message,
        );

      } else {

        setError(
          "Não foi possível criar a conta.",
        );
      }

    } finally {

      setLoading(false);
    }
  }

  return (
    <form
      className="register-form"
      onSubmit={handleSubmit}
    >

      {error && (
        <div className="form-error">
          {error}
        </div>
      )}

      <div className="form-section">

        <h3>Dados pessoais</h3>

        <div className="form-group">

          <label>
            Nome completo *
          </label>

          <div className="input-container">

            <User size={18} />

            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              placeholder="Nome completo"
            />

          </div>

        </div>

        <div className="form-row">

          <div className="form-group">

            <label>
              E-mail *
            </label>

            <div className="input-container">

              <Mail size={18} />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="seu@email.com"
              />

            </div>

          </div>

          <div className="form-group">

            <label>
              Data de nascimento *
            </label>

            <div className="input-container">

              <input
                name="dataNascimento"
                type="date"
                value={
                  form.dataNascimento
                }
                onChange={handleChange}
              />

            </div>

          </div>

        </div>

        <div className="form-group">

          <label>
            Sexo *
          </label>

          <div className="input-container">

            <select
              name="sexo"
              value={form.sexo}
              onChange={handleChange}
            >

              <option value="">
                Selecione
              </option>

              <option value="MASCULINO">
                Masculino
              </option>

              <option value="FEMININO">
                Feminino
              </option>

              <option value="OUTRO">
                Outro
              </option>

              <option value="NAO_INFORMADO">
                Prefiro não informar
              </option>

            </select>

          </div>

        </div>

      </div>

      <div className="form-section">

        <h3>Contato</h3>

        <div className="form-row">

          <div className="form-group">

            <label>
              Celular *
            </label>

            <div className="input-container">

              <Phone size={18} />

              <input
                name="celular"
                value={form.celular}
                onChange={
                  handleCelular
                }
                placeholder="99 9 9999-9999"
              />

            </div>

          </div>

          <div className="form-group">

            <label>
              Telefone
            </label>

            <div className="input-container">

              <Phone size={18} />

              <input
                name="telefone"
                value={form.telefone}
                onChange={
                  handleTelefone
                }
                placeholder="99 9999-9999"
              />

            </div>

          </div>

        </div>

      </div>

      <div className="form-section">

        <h3>Endereço</h3>

        <div className="form-group cep-group">

          <label>
            CEP *
          </label>

          <div className="input-container">

            <MapPin size={18} />

            <input
              name="cep"
              value={form.cep}
              onChange={handleCep}
              onBlur={handleCepBlur}
              placeholder="99999-999"
            />

            {searchingCep && (
              <span className="cep-loading">
                Buscando...
              </span>
            )}

          </div>

        </div>

        <div className="form-group">

          <label>
            Logradouro *
          </label>

          <div className="input-container">

            <input
              name="logradouro"
              value={form.logradouro}
              onChange={handleChange}
            />

          </div>

        </div>

        <div className="form-row">

          <div className="form-group">

            <label>
              Número *
            </label>

            <div className="input-container">

              <input
                name="numero"
                value={form.numero}
                onChange={handleChange}
              />

            </div>

          </div>

          <div className="form-group">

            <label>
              Complemento
            </label>

            <div className="input-container">

              <input
                name="complemento"
                value={
                  form.complemento
                }
                onChange={handleChange}
              />

            </div>

          </div>

        </div>

        <div className="form-group">

          <label>
            Bairro *
          </label>

          <div className="input-container">

            <input
              name="bairro"
              value={form.bairro}
              onChange={handleChange}
            />

          </div>

        </div>

        <div className="form-row">

          <div className="form-group">

            <label>
              Cidade *
            </label>

            <div className="input-container">

              <input
                name="cidade"
                value={form.cidade}
                onChange={handleChange}
              />

            </div>

          </div>

          <div className="form-group uf-field">

            <label>
              UF *
            </label>

            <div className="input-container">

              <input
                name="uf"
                maxLength={2}
                value={form.uf}
                onChange={handleChange}
              />

            </div>

          </div>

        </div>

      </div>

      <div className="form-section">

        <h3>Dados de acesso</h3>

        <div className="form-group">

          <label>
            Usuário *
          </label>

          <div className="input-container">

            <User size={18} />

            <input
              name="userName"
              value={form.userName}
              onChange={handleChange}
              placeholder="Escolha seu usuário"
            />

          </div>

        </div>

        <div className="form-row">

          <div className="form-group">

            <label>
              Senha *
            </label>

            <div className="input-container">

              <LockKeyhole size={18} />

              <input
                name="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={form.password}
                onChange={handleChange}
              />

              <button
                type="button"
                className="password-button"
                onClick={() =>
                  setShowPassword(
                    !showPassword,
                  )
                }
              >
                {showPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
                }
              </button>

            </div>

          </div>

          <div className="form-group">

            <label>
              Confirmar senha *
            </label>

            <div className="input-container">

              <LockKeyhole size={18} />

              <input
                name="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={
                  form.confirmPassword
                }
                onChange={handleChange}
              />

              <button
                type="button"
                className="password-button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword,
                  )
                }
              >
                {showConfirmPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
                }
              </button>

            </div>

          </div>

        </div>

      </div>

      <div className="register-actions">

        <button
          type="button"
          className="back-button"
          onClick={() => navigate("/")}
          disabled={loading}
        >
          Voltar
        </button>

        <button
          type="submit"
          className="create-account-button"
          disabled={loading}
        >
          {loading
            ? "Criando conta..."
            : "Criar minha conta"
          }
        </button>

      </div>

    </form>
  );
}