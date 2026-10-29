package com.ecoera.service;

import com.ecoera.model.Troca;
import com.ecoera.repository.TrocaRepository;
import com.ecoera.exception.RecursoNaoEncontradoException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TrocaService {

    private final TrocaRepository repository;

    public TrocaService(TrocaRepository repository) {
        this.repository = repository;
    }

    public List<Troca> listarTodas() {
        return repository.findAll();
    }

    public List<Troca> listarPorStatus(String status) {
        return repository.findByStatus(status);
    }

    public Troca buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Troca não encontrada: " + id));
    }

    public Troca salvar(Troca troca) {
        if (troca.getStatus() == null) {
            troca.setStatus("PENDENTE");
        }
        if (troca.getDataTroca() == null) {
            troca.setDataTroca(LocalDate.now());
        }
        return repository.save(troca);
    }

    public Troca atualizar(Long id, Troca dados) {
        Troca existente = buscarPorId(id);
        if (dados.getNomePessoa() != null) existente.setNomePessoa(dados.getNomePessoa());
        if (dados.getContato() != null) existente.setContato(dados.getContato());
        if (dados.getDescricao() != null) existente.setDescricao(dados.getDescricao());
        if (dados.getItemDesejado() != null) existente.setItemDesejado(dados.getItemDesejado());
        if (dados.getQuantidade() != null) existente.setQuantidade(dados.getQuantidade());
        if (dados.getStatus() != null) existente.setStatus(dados.getStatus());
        if (dados.getDataTroca() != null) existente.setDataTroca(dados.getDataTroca());
        if (dados.getMaterial() != null) existente.setMaterial(dados.getMaterial());
        if (dados.getPonto() != null) existente.setPonto(dados.getPonto());
        return repository.save(existente);
    }
    public Troca concluir(Long id) {
        Troca troca = buscarPorId(id);
        troca.setStatus("CONCLUIDA");
        return repository.save(troca);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        repository.deleteById(id);
    }
}