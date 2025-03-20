package com.example.demo.service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Stock;
import com.example.demo.repo.StockRepo;

import jakarta.transaction.Transactional;

@Service
public class StockService {
	
	private final StockRepo stockRepo;
	private final Random random = new Random();
	
	@Autowired
	public StockService(StockRepo stockRepo) {
		this.stockRepo = stockRepo;
	}
	
	public List<Stock> getAllStocks() {
        return stockRepo.findAll();
    }
	
	public Optional<Stock> getStockById(Long id) {
        return stockRepo.findById(id);
    }
	
	@Transactional
	public Stock createStock(Stock stock) {
		float price = generateRandomPrice(stock.getMinPrice(), stock.getMaxPrice());
		stock.setCurrentPrice(price);
		
		return stockRepo.save(stock);
	}
	
	@Transactional
	public Optional<Stock> updateStock(Long id, Stock stockDetails) {
        return stockRepo.findById(id)
                .map(existingStock -> {
                    existingStock.setName(stockDetails.getName());
                    existingStock.setQuantity(stockDetails.getQuantity());
                    existingStock.setMinPrice(stockDetails.getMinPrice());
                    existingStock.setMaxPrice(stockDetails.getMaxPrice());
  
                    float price = existingStock.getCurrentPrice();
                    if (price < stockDetails.getMinPrice()) {
                        price = stockDetails.getMinPrice();
                    } else if (price > stockDetails.getMaxPrice()) {
                        price = stockDetails.getMaxPrice();
                    }
                    existingStock.setCurrentPrice(price);
                    
                    return stockRepo.save(existingStock);
                });
    }
	
	@Transactional
    public boolean deleteStock(Long id) {
        return stockRepo.findById(id)
                .map(stock -> {
                    stockRepo.delete(stock);
                    return true;
                })
                .orElse(false);
    }
	
	@Transactional
    public Optional<Stock> updateStockPrice(Long id) {
        return stockRepo.findById(id)
                .map(stock -> {
                    float price = generateRandomPrice(stock.getMinPrice(), stock.getMaxPrice());
                    stock.setCurrentPrice(price);
                    return stockRepo.save(stock);
                });
    }
	
	public float generateRandomPrice(float min, float max) {
        float range = max - min;
        float randomFactor = (float)random.nextDouble();
        
        return Math.round((min + range * randomFactor) * 100) / 100.0f;
    }
}
