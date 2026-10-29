package com.ecoera.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "tipos_material")
public class TipoMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    private String descricao;

    @JsonIgnore // evita loop infinito Ponto -> Material -> Ponto no JSON
    @ManyToMany(mappedBy = "materiais")
    private List<PontoReciclagem> pontos;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public List<PontoReciclagem> getPontos() { return pontos; }
    public void setPontos(List<PontoReciclagem> pontos) { this.pontos = pontos; }
}