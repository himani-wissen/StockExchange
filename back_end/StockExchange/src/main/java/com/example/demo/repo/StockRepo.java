package com.example.demo.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.model.Stock;

@Repository
public interface StockRepo extends JpaRepository<Stock, Long> {
	
	@Modifying
	@Query("UPDATE Stock s SET s.currentPrice = :price, s.updatedAt = CURRENT_TIMESTAMP where s.id = :id")
	void updateStockPrice(@Param("id") Long id, @Param("price") float price);
}
