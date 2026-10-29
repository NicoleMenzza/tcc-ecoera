import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const HistoricoTrocas = () => {
  const [trocas, setTrocas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [msgEdicao, setMsgEdicao] = useState("");

  const carregar = async () => {
    setCarregando(true);
    setErro("");
    try {
      const response = await api.get("/api/trocas");
      setTrocas(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar trocas:", error);
      setErro("Não foi possível carregar o histórico de trocas.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const STATUS_OPCOES = ["PENDENTE", "CONFIRMADA", "CONCLUIDA", "CANCELADA"];

  const abrirEdicao = (t) => {
    setEditando(t);
    setForm({
      nomePessoa: t.nomePessoa || "",
      descricao: t.descricao || "",
      itemDesejado: t.itemDesejado || "",
      quantidade: t.quantidade ?? 1,
      status: t.status || "PENDENTE",
      contato: t.contato || "",
    });
    setMsgEdicao("");
  };

  const fecharEdicao = () => {
    setEditando(null);
    setForm({});
    setMsgEdicao("");
  };

  const salvarEdicao = async (e) => {
    e.preventDefault();
    if (!editando) return;
    setSalvando(true);
    setMsgEdicao("");
    try {
      await api.put(`/api/trocas/${editando.id}`, {
        nomePessoa: form.nomePessoa,
        descricao: form.descricao,
        itemDesejado: form.itemDesejado,
        quantidade: Number(form.quantidade),
        status: form.status,
        contato: form.contato,
      });
      await carregar();
      fecharEdicao();
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.erro ||
        error.message ||
        "Erro ao salvar alterações.";
      setMsgEdicao(msg);
    } finally {
      setSalvando(false);
    }
  };

  const deletar = async (id) => {
    if (!window.confirm("Deseja realmente excluir este item?")) return;
    try {
      await api.delete(`/api/trocas/${id}`);
      await carregar();
    } catch (error) {
      console.error("Erro ao excluir item:", error);
      alert("Não foi possível excluir o item.");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold m-0" style={{ color: "#2d6a4f" }}>
          <i className="fas fa-history me-2"></i>Histórico de Trocas
        </h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary btn-sm" onClick={carregar}>
            <i className="fas fa-sync-alt me-1"></i> Atualizar
          </button>
          <Link to="/novo-item" className="btn btn-success btn-sm">
            <i className="fas fa-plus-circle me-1"></i> Novo Item
          </Link>
        </div>
      </div>

      {carregando && (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
          <p className="mt-2 text-muted">Carregando...</p>
        </div>
      )}

      {erro && <div className="alert alert-danger">{erro}</div>}

      {!carregando && !erro && trocas.length === 0 && (
        <div className="alert alert-info">
          Nenhum item cadastrado ainda.{" "}
          <Link to="/novo-item">Cadastre o primeiro item</Link>.
        </div>
      )}

      {!carregando && trocas.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-success">
              <tr>
                <th>#</th>
                <th>Nome do Item</th>
                <th>Descrição</th>
                <th>Deseja em troca</th>
                <th>Qtd.</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {trocas.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.nomePessoa}</td>
                  <td>{t.descricao || "-"}</td>
                  <td>{t.itemDesejado || "-"}</td>
                  <td>{t.quantidade}</td>
                  <td>
                    <span className="badge bg-secondary">{t.status}</span>
                  </td>
                  <td>{t.dataTroca}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => abrirEdicao(t)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => deletar(t.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editando && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={salvarEdicao}>
                <div className="modal-header">
                  <h5 className="modal-title">Editar Item #{editando.id}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={fecharEdicao}
                  ></button>
                </div>
                <div className="modal-body">
                  {msgEdicao && (
                    <div className="alert alert-danger">{msgEdicao}</div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Nome do Item</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.nomePessoa}
                      onChange={(e) =>
                        setForm({ ...form, nomePessoa: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contato</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.contato}
                      onChange={(e) =>
                        setForm({ ...form, contato: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descrição</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={form.descricao}
                      onChange={(e) =>
                        setForm({ ...form, descricao: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">O que deseja em troca?</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.itemDesejado}
                      onChange={(e) =>
                        setForm({ ...form, itemDesejado: e.target.value })
                      }
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Quantidade</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={form.quantidade}
                        onChange={(e) =>
                          setForm({ ...form, quantidade: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-8 mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        value={form.status}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value })
                        }
                      >
                        {STATUS_OPCOES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={fecharEdicao}
                    disabled={salvando}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={salvando}
                  >
                    {salvando ? "Salvando..." : "Salvar alterações"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HistoricoTrocas;