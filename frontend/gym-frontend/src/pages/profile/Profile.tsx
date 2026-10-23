import {
  useEffect,
  useState,
} from "react";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Save,
  UserRound,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import {
  alterarSenha,
  atualizarPerfil,
  buscarPerfil,
} from "../../services/profileService";

import {
  buscarCep,
} from "../../services/cepService";

import type {
  PessoaUpdateRequest,
} from "../../types/profile";

import "../../styles/profile/profile.css";


type Aba =
  | "dados"
  | "senha";


type TipoSucesso =
  | "perfil"
  | "senha"
  | null;


const formInicial: PessoaUpdateRequest = {

  nome: "",
  email: "",
  dataNascimento: "",
  sexo: "",
  telefone: "",
  celular: "",
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
  userId: null,
};


function somenteNumeros(
  valor: string,
): string {

  return valor.replace(
    /\D/g,
    "",
  );
}


function mascaraTelefone(
  valor: string,
): string {

  const numeros =
    somenteNumeros(
      valor,
    ).slice(
      0,
      10,
    );

  if (
    numeros.length <= 2
  ) {

    return numeros;
  }

  if (
    numeros.length <= 6
  ) {

    return (
      `${numeros.slice(0, 2)} ` +
      `${numeros.slice(2)}`
    );
  }

  return (
    `${numeros.slice(0, 2)} ` +
    `${numeros.slice(2, 6)}-` +
    `${numeros.slice(6, 10)}`
  );
}


function mascaraCelular(
  valor: string,
): string {

  const numeros =
    somenteNumeros(
      valor,
    ).slice(
      0,
      11,
    );

  if (
    numeros.length <= 2
  ) {

    return numeros;
  }

  if (
    numeros.length <= 3
  ) {

    return (
      `${numeros.slice(0, 2)} ` +
      `${numeros.slice(2)}`
    );
  }

  if (
    numeros.length <= 7
  ) {

    return (
      `${numeros.slice(0, 2)} ` +
      `${numeros.slice(2, 3)} ` +
      `${numeros.slice(3)}`
    );
  }

  return (
    `${numeros.slice(0, 2)} ` +
    `${numeros.slice(2, 3)} ` +
    `${numeros.slice(3, 7)}-` +
    `${numeros.slice(7, 11)}`
  );
}


function mascaraCep(
  valor: string,
): string {

  const numeros =
    somenteNumeros(
      valor,
    ).slice(
      0,
      8,
    );

  if (
    numeros.length <= 5
  ) {

    return numeros;
  }

  return (
    `${numeros.slice(0, 5)}-` +
    `${numeros.slice(5, 8)}`
  );
}


export function Profile() {

  const navigate =
    useNavigate();


  const [
    aba,
    setAba,
  ] =
    useState<Aba>(
      "dados",
    );


  const [
    form,
    setForm,
  ] =
    useState<PessoaUpdateRequest>(
      formInicial,
    );


  const [
    carregando,
    setCarregando,
  ] =
    useState(
      true,
    );


  const [
    salvando,
    setSalvando,
  ] =
    useState(
      false,
    );


  const [
    consultandoCep,
    setConsultandoCep,
  ] =
    useState(
      false,
    );


  const [
    erro,
    setErro,
  ] =
    useState(
      "",
    );


  const [
    sucesso,
    setSucesso,
  ] =
    useState<TipoSucesso>(
      null,
    );


  const [
    senhaAtual,
    setSenhaAtual,
  ] =
    useState(
      "",
    );


  const [
    novaSenha,
    setNovaSenha,
  ] =
    useState(
      "",
    );


  const [
    confirmarSenha,
    setConfirmarSenha,
  ] =
    useState(
      "",
    );


  const [
    mostrarSenhaAtual,
    setMostrarSenhaAtual,
  ] =
    useState(
      false,
    );


  const [
    mostrarNovaSenha,
    setMostrarNovaSenha,
  ] =
    useState(
      false,
    );


  const [
    mostrarConfirmacao,
    setMostrarConfirmacao,
  ] =
    useState(
      false,
    );


  useEffect(
    () => {

      carregarPerfil();

    },
    [],
  );


  async function carregarPerfil() {

    const pessoaId =
      sessionStorage.getItem(
        "pessoaId",
      );


    if (
      !pessoaId
    ) {

      logout();

      return;
    }


    try {

      setCarregando(
        true,
      );

      setErro(
        "",
      );


      const pessoa =
        await buscarPerfil(
          Number(
            pessoaId,
          ),
        );


      const userId =
        sessionStorage.getItem(
          "userId",
        );


      setForm({

        nome:
          pessoa.nome ?? "",

        email:
          pessoa.email ?? "",

        dataNascimento:
          pessoa.dataNascimento ?? "",

        sexo:
          pessoa.sexo ?? "",

        telefone:
          mascaraTelefone(
            pessoa.telefone ?? "",
          ),

        celular:
          mascaraCelular(
            pessoa.celular ?? "",
          ),

        cep:
          mascaraCep(
            pessoa.cep ?? "",
          ),

        logradouro:
          pessoa.logradouro ?? "",

        numero:
          pessoa.numero ?? "",

        complemento:
          pessoa.complemento ?? "",

        bairro:
          pessoa.bairro ?? "",

        cidade:
          pessoa.cidade ?? "",

        uf:
          pessoa.uf ?? "",

        userId,
      });


      sessionStorage.setItem(
        "pessoa",
        JSON.stringify(
          pessoa,
        ),
      );

    } catch (error) {

      tratarErro(
        error,
      );

    } finally {

      setCarregando(
        false,
      );
    }
  }


  function handleChange(
    event:
      React.ChangeEvent<
        HTMLInputElement |
        HTMLSelectElement
      >,
  ) {

    const {
      name,
      value,
    } =
      event.target;


    let novoValor =
      value;


    if (
      name === "nome"
    ) {

      novoValor =
        value.toUpperCase();
    }


    if (
      name === "email"
    ) {

      novoValor =
        value.toLowerCase();
    }


    if (
      name === "uf"
    ) {

      novoValor =
        value
          .toUpperCase()
          .replace(
            /[^A-Z]/g,
            "",
          )
          .slice(
            0,
            2,
          );
    }


    if (
      name === "telefone"
    ) {

      novoValor =
        mascaraTelefone(
          value,
        );
    }


    if (
      name === "celular"
    ) {

      novoValor =
        mascaraCelular(
          value,
        );
    }


    if (
      name === "cep"
    ) {

      novoValor =
        mascaraCep(
          value,
        );
    }


    setForm(
      atual => ({
        ...atual,
        [name]:
          novoValor,
      }),
    );
  }


  async function consultarCep() {

    const cep =
      somenteNumeros(
        form.cep,
      );


    if (
      cep.length === 0
    ) {

      return;
    }


    if (
      cep.length !== 8
    ) {

      setErro(
        "O CEP deve possuir exatamente 8 números.",
      );

      return;
    }


    try {

      setConsultandoCep(
        true,
      );

      setErro(
        "",
      );


      const endereco =
        await buscarCep(
          cep,
        );


      setForm(
        atual => ({

          ...atual,

          logradouro:
            endereco.logradouro ?? "",

          bairro:
            endereco.bairro ?? "",

          cidade:
            endereco.localidade ?? "",

          uf:
            endereco.uf ?? "",
        }),
      );

    } catch (error) {

      if (
        error instanceof Error
      ) {

        setErro(
          error.message,
        );

      } else {

        setErro(
          "Não foi possível consultar o CEP.",
        );
      }

    } finally {

      setConsultandoCep(
        false,
      );
    }
  }


  async function salvarPerfil() {

    setErro(
      "",
    );


    if (
      !form.nome.trim()
    ) {

      setErro(
        "Informe o nome.",
      );

      return;
    }


    if (
      !form.email.trim()
    ) {

      setErro(
        "Informe o e-mail.",
      );

      return;
    }


    if (
      form.telefone
      &&
      somenteNumeros(
        form.telefone,
      ).length !== 10
    ) {

      setErro(
        "O telefone residencial deve possuir DDD e 8 números.",
      );

      return;
    }


    if (
      form.celular
      &&
      somenteNumeros(
        form.celular,
      ).length !== 11
    ) {

      setErro(
        "O celular deve possuir DDD e 9 números.",
      );

      return;
    }


    if (
      form.cep
      &&
      somenteNumeros(
        form.cep,
      ).length !== 8
    ) {

      setErro(
        "O CEP deve possuir exatamente 8 números.",
      );

      return;
    }


    if (
      form.uf
      &&
      form.uf.length !== 2
    ) {

      setErro(
        "A UF deve possuir exatamente 2 letras.",
      );

      return;
    }


    const pessoaId =
      sessionStorage.getItem(
        "pessoaId",
      );


    if (
      !pessoaId
    ) {

      logout();

      return;
    }


    const request:
      PessoaUpdateRequest = {

      ...form,

      telefone:
        somenteNumeros(
          form.telefone,
        ),

      celular:
        somenteNumeros(
          form.celular,
        ),

      cep:
        somenteNumeros(
          form.cep,
        ),
    };


    try {

      setSalvando(
        true,
      );


      const response =
        await atualizarPerfil(
          Number(
            pessoaId,
          ),
          request,
        );


      if (
        response
      ) {

        sessionStorage.setItem(
          "pessoa",
          JSON.stringify(
            response,
          ),
        );

      } else {

        const pessoa =
          await buscarPerfil(
            Number(
              pessoaId,
            ),
          );


        sessionStorage.setItem(
          "pessoa",
          JSON.stringify(
            pessoa,
          ),
        );
      }


      setSucesso(
        "perfil",
      );

    } catch (error) {

      tratarErro(
        error,
      );

    } finally {

      setSalvando(
        false,
      );
    }
  }


  async function salvarSenha() {

    setErro(
      "",
    );


    if (
      !senhaAtual
    ) {

      setErro(
        "Informe a senha atual.",
      );

      return;
    }


    if (
      !novaSenha
    ) {

      setErro(
        "Informe a nova senha.",
      );

      return;
    }


    if (
      novaSenha.length < 8
    ) {

      setErro(
        "A nova senha deve possuir no mínimo 8 caracteres.",
      );

      return;
    }


    if (
      senhaAtual ===
      novaSenha
    ) {

      setErro(
        "A nova senha deve ser diferente da senha atual.",
      );

      return;
    }


    if (
      novaSenha !==
      confirmarSenha
    ) {

      setErro(
        "A confirmação da nova senha não confere.",
      );

      return;
    }


    try {

      setSalvando(
        true,
      );


      await alterarSenha({

        senhaAtual,

        novaSenha,
      });


      setSenhaAtual(
        "",
      );

      setNovaSenha(
        "",
      );

      setConfirmarSenha(
        "",
      );


      setSucesso(
        "senha",
      );

    } catch (error) {

      tratarErro(
        error,
      );

    } finally {

      setSalvando(
        false,
      );
    }
  }


  function tratarErro(
    error: unknown,
  ) {

    if (
      error instanceof Error
    ) {

      if (
        error.message ===
        "UNAUTHORIZED"
      ) {

        logout();

        return;
      }


      setErro(
        error.message,
      );

      return;
    }


    setErro(
      "Ocorreu um erro inesperado.",
    );
  }


  function logout() {

    sessionStorage.clear();


    navigate(
      "/login",
      {
        replace: true,
      },
    );
  }


  function trocarAba(
    novaAba: Aba,
  ) {

    setAba(
      novaAba,
    );

    setErro(
      "",
    );
  }


  if (
    carregando
  ) {

    return (

      <div className="profile-loading">

        Carregando perfil...

      </div>
    );
  }


  if (
    sucesso
  ) {

    return (

      <div className="profile-page">

        <div className="profile-success-page">

          <div className="profile-success-icon">

            <CheckCircle2
              size={42}
            />

          </div>


          <h1>

            {
              sucesso === "perfil"
                ? "Perfil atualizado!"
                : "Senha alterada!"
            }

          </h1>


          <p>

            {
              sucesso === "perfil"
                ? "Seus dados foram salvos com sucesso."
                : "Sua senha foi alterada com sucesso."
            }

          </p>


          <button
            type="button"
            className="profile-button-primary"
            onClick={() =>
              navigate(
                "/home",
              )
            }
          >

            Retornar para Home

          </button>

        </div>

      </div>
    );
  }


  return (

    <div className="profile-page">

      <div className="profile-container">

        <header className="profile-header">

          <button
            className="profile-back"
            type="button"
            onClick={() =>
              navigate(
                "/home",
              )
            }
          >

            <ArrowLeft
              size={19}
            />

            Voltar

          </button>


          <div>

            <span className="profile-label">

              MINHA CONTA

            </span>


            <h1>

              Meu perfil

            </h1>


            <p>

              Atualize seus dados pessoais
              ou altere sua senha de acesso.

            </p>

          </div>

        </header>


        <div className="profile-card">

          <div className="profile-tabs">

            <button
              type="button"
              className={
                aba === "dados"
                  ? "active"
                  : ""
              }
              onClick={() =>
                trocarAba(
                  "dados",
                )
              }
            >

              <UserRound
                size={19}
              />

              Editar dados

            </button>


            <button
              type="button"
              className={
                aba === "senha"
                  ? "active"
                  : ""
              }
              onClick={() =>
                trocarAba(
                  "senha",
                )
              }
            >

              <KeyRound
                size={19}
              />

              Alterar senha

            </button>

          </div>


          {
            erro
            &&
            (

              <div className="profile-error">

                {erro}

              </div>
            )
          }


          {
            aba === "dados"
              ? (

                <div className="profile-content">

                  <div className="profile-section-header">

                    <h2>

                      Dados pessoais

                    </h2>

                    <p>

                      Mantenha suas informações
                      pessoais atualizadas.

                    </p>

                  </div>


                  <div className="profile-grid">

                    <div className="profile-field profile-full">

                      <label>

                        Nome completo

                      </label>

                      <input
                        type="text"
                        name="nome"
                        maxLength={150}
                        value={
                          form.nome
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>


                    <div className="profile-field">

                      <label>

                        E-mail

                      </label>

                      <input
                        disabled
                        type="email"
                        name="email"
                        maxLength={200}
                        value={
                          form.email
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>


                    <div className="profile-field">

                      <label>

                        Data de nascimento

                      </label>

                      <input
                        type="date"
                        name="dataNascimento"
                        value={
                          form.dataNascimento
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>


                    <div className="profile-field">

                      <label>

                        Sexo

                      </label>

                      <select
                        name="sexo"
                        value={
                          form.sexo
                        }
                        onChange={
                          handleChange
                        }
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

                        <option value="NAO_INFORMADO">

                          Prefiro não informar

                        </option>

                      </select>

                    </div>


                    <div className="profile-field">

                      <label>

                        Telefone residencial

                      </label>

                      <input
                        type="text"
                        name="telefone"
                        maxLength={12}
                        placeholder="11 3333-4444"
                        value={
                          form.telefone
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>


                    <div className="profile-field">

                      <label>

                        Celular

                      </label>

                      <input
                        type="text"
                        name="celular"
                        maxLength={14}
                        placeholder="11 9 9999-9999"
                        value={
                          form.celular
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>

                  </div>


                  <div className="profile-divider" />


                  <div className="profile-section-header">

                    <h2>

                      Endereço

                    </h2>

                    <p>

                      Informe o CEP para preencher
                      automaticamente o endereço.

                    </p>

                  </div>


                  <div className="profile-grid">

                    <div className="profile-field">

                      <label>

                        CEP

                      </label>

                      <input
                        type="text"
                        name="cep"
                        maxLength={9}
                        placeholder="99999-999"
                        value={
                          form.cep
                        }
                        onChange={
                          handleChange
                        }
                        onBlur={
                          consultarCep
                        }
                      />

                      {
                        consultandoCep
                        &&
                        (

                          <span className="profile-field-info">

                            Consultando CEP...

                          </span>
                        )
                      }

                    </div>


                    <div className="profile-field">

                      <label>

                        Número

                      </label>

                      <input
                        type="text"
                        name="numero"
                        maxLength={20}
                        value={
                          form.numero
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>


                    <div className="profile-field profile-full">

                      <label>

                        Logradouro

                      </label>

                      <input
                        type="text"
                        name="logradouro"
                        maxLength={200}
                        value={
                          form.logradouro
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>


                    <div className="profile-field">

                      <label>

                        Complemento

                      </label>

                      <input
                        type="text"
                        name="complemento"
                        maxLength={100}
                        value={
                          form.complemento
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>


                    <div className="profile-field">

                      <label>

                        Bairro

                      </label>

                      <input
                        type="text"
                        name="bairro"
                        maxLength={100}
                        value={
                          form.bairro
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>


                    <div className="profile-field">

                      <label>

                        Cidade

                      </label>

                      <input
                        type="text"
                        name="cidade"
                        maxLength={100}
                        value={
                          form.cidade
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>


                    <div className="profile-field">

                      <label>

                        UF

                      </label>

                      <input
                        type="text"
                        name="uf"
                        maxLength={2}
                        value={
                          form.uf
                        }
                        onChange={
                          handleChange
                        }
                      />

                    </div>

                  </div>


                  <div className="profile-actions">

                    <button
                      type="button"
                      className="profile-button-secondary"
                      onClick={() =>
                        navigate(
                          "/home",
                        )
                      }
                    >

                      Cancelar

                    </button>


                    <button
                      type="button"
                      className="profile-button-primary"
                      disabled={
                        salvando
                        ||
                        consultandoCep
                      }
                      onClick={
                        salvarPerfil
                      }
                    >

                      <Save
                        size={18}
                      />

                      {
                        salvando
                          ? "Salvando..."
                          : "Confirmar"
                      }

                    </button>

                  </div>

                </div>

              )
              : (

                <div className="profile-content password-content">

                  <div className="profile-section-header">

                    <h2>

                      Alterar senha

                    </h2>

                    <p>

                      Informe sua senha atual
                      e escolha uma nova senha
                      para sua conta.

                    </p>

                  </div>


                  <div className="password-form">

                    <div className="profile-field">

                      <label>

                        Senha atual

                      </label>

                      <div className="password-input">

                        <input
                          type={
                            mostrarSenhaAtual
                              ? "text"
                              : "password"
                          }
                          value={
                            senhaAtual
                          }
                          onChange={
                            event =>
                              setSenhaAtual(
                                event.target.value,
                              )
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setMostrarSenhaAtual(
                              atual =>
                                !atual,
                            )
                          }
                        >

                          {
                            mostrarSenhaAtual
                              ? (

                                <EyeOff
                                  size={19}
                                />

                              )
                              : (

                                <Eye
                                  size={19}
                                />

                              )
                          }

                        </button>

                      </div>

                    </div>


                    <div className="profile-field">

                      <label>

                        Nova senha

                      </label>

                      <div className="password-input">

                        <input
                          type={
                            mostrarNovaSenha
                              ? "text"
                              : "password"
                          }
                          value={
                            novaSenha
                          }
                          onChange={
                            event =>
                              setNovaSenha(
                                event.target.value,
                              )
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setMostrarNovaSenha(
                              atual =>
                                !atual,
                            )
                          }
                        >

                          {
                            mostrarNovaSenha
                              ? (

                                <EyeOff
                                  size={19}
                                />

                              )
                              : (

                                <Eye
                                  size={19}
                                />

                              )
                          }

                        </button>

                      </div>

                    </div>


                    <div className="profile-field">

                      <label>

                        Confirmar nova senha

                      </label>

                      <div className="password-input">

                        <input
                          type={
                            mostrarConfirmacao
                              ? "text"
                              : "password"
                          }
                          value={
                            confirmarSenha
                          }
                          onChange={
                            event =>
                              setConfirmarSenha(
                                event.target.value,
                              )
                          }
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setMostrarConfirmacao(
                              atual =>
                                !atual,
                            )
                          }
                        >

                          {
                            mostrarConfirmacao
                              ? (

                                <EyeOff
                                  size={19}
                                />

                              )
                              : (

                                <Eye
                                  size={19}
                                />

                              )
                          }

                        </button>

                      </div>

                    </div>


                    <div className="password-info">

                      A nova senha deve possuir
                      no mínimo 8 caracteres.

                    </div>

                  </div>


                  <div className="profile-actions">

                    <button
                      type="button"
                      className="profile-button-secondary"
                      onClick={() =>
                        navigate(
                          "/home",
                        )
                      }
                    >

                      Cancelar

                    </button>


                    <button
                      type="button"
                      className="profile-button-primary"
                      disabled={
                        salvando
                      }
                      onClick={
                        salvarSenha
                      }
                    >

                      <KeyRound
                        size={18}
                      />

                      {
                        salvando
                          ? "Alterando..."
                          : "Confirmar"
                      }

                    </button>

                  </div>

                </div>
              )
          }

        </div>

      </div>

    </div>
  );
}