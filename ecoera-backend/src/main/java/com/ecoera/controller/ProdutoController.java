package com.ecoera.controller;

import com.ecoera.model.Produto;
import com.ecoera.repository.ProdutoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/produtos")
public class ProdutoController {

    private final ProdutoRepository repository;

    public ProdutoController(ProdutoRepository repository) {
        this.repository = repository;
    }

    // CADASTRAR PRODUTO (o que o front vai usar)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Produto cadastrar(@RequestBody Produto produto) {
        return repository.save(produto);
    }

    // LISTAR TODOS OS PRODUTOS
    @GetMapping
    public List<Produto> listar() {
        return repository.findAll();
    }

    // BUSCAR UM PRODUTO PELO ID
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ATUALIZAR PRODUTO
    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizar(@PathVariable Long id, @RequestBody Produto dados) {
        return repository.findById(id).map(p -> {
            p.setNome(dados.getNome());
            p.setDescricao(dados.getDescricao());
            p.setPrecoPontos(dados.getPrecoPontos());
            p.setQuantidade(dados.getQuantidade());
            return ResponseEntity.ok(repository.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETAR UM PRODUTO PELO ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}