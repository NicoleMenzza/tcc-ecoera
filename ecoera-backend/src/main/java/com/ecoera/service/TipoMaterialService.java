package com.ecoera.service;

import com.ecoera.model.TipoMaterial;
import com.ecoera.repository.TipoMaterialRepository;
import com.ecoera.exception.RecursoNaoEncontradoException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TipoMaterialService {

    private final TipoMaterialRepository repository;

    public TipoMaterialService(TipoMaterialRepository repository) {
        this.repository = repository;
    }

    public List<TipoMaterial> listarTodos() {
        return repository.findAll();
    }

    public TipoMaterial buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Tipo de material não encontrado: " + id));
    }

    public TipoMaterial salvar(TipoMaterial material) {
        return repository.save(material);
    }

    public TipoMaterial atualizar(Long id, TipoMaterial dadosNovos) {
        TipoMaterial material = buscarPorId(id);
        material.setNome(dadosNovos.getNome());
        material.setDescricao(dadosNovos.getDescricao());
        return repository.save(material);
    }

    public void deletar(Long id) {
        buscarPorId(id);
        repository.deleteById(id);
    }
}
