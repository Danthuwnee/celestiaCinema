package com.cinema.repository;

import org.springframework.data.jpa.domain.Specification;

import com.cinema.entity.Movie;
import com.cinema.enums.EntityStatus;

import jakarta.persistence.criteria.Predicate;

import java.util.List;

public class MovieSpecifications {

    public static Specification<Movie> statusIn(List<EntityStatus> statuses) {
        return (root, query, cb) -> root.get("status").in(statuses);
    }

    public static Specification<Movie> titleContainsAllWords(String keyword) {
        return (root, query, cb) -> {
            String[] words = keyword.trim().toLowerCase().split("\\s+");
            Predicate[] predicates = new Predicate[words.length];
            for (int i = 0; i < words.length; i++) {
                predicates[i] = cb.like(
                    cb.lower(cb.concat(cb.concat(cb.literal(" "), root.get("title")), cb.literal(" "))),
                    "% " + words[i] + " %"
                );
            }
            return cb.and(predicates);
        };
    }
}
