package com.example.demo.service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;

import com.example.demo.model.Stock;

public class PriceFluctuationService {
	
	private static final Logger logger = LoggerFactory.getLogger(PriceFluctuationService.class);
	private final StockService stockService;
    private final SimpMessagingTemplate messagingTemplate;
    private final Map<Long, Stock> stockCache = new ConcurrentHashMap<>();
    
    @Autowired
    public PriceFluctuationService(StockService stockService, SimpMessagingTemplate messagingTemplate) {
        this.stockService = stockService;
        this.messagingTemplate = messagingTemplate;
    }
    
    @Scheduled(fixedRate = 1000)
    public void updatePrices() {
        try {
            List<Stock> stocks = stockService.getAllStocks();
            
            for (Stock stock : stocks) {
                stockService.updateStockPrice(stock.getId())
                        .ifPresent(updatedStock -> {
                        	
                            Stock previousStock = stockCache.get(updatedStock.getId());
                            
                            stockCache.put(updatedStock.getId(), updatedStock);
                            
                            messagingTemplate.convertAndSend("/topic/stock-prices", updatedStock);
                            
                            if (previousStock != null) {
                                logger.debug("Price updated for {}: {} -> {}", 
                                        updatedStock.getName(),
                                        previousStock.getCurrentPrice(),
                                        updatedStock.getCurrentPrice());
                            }
                        });
            }
        } catch (Exception e) {
            logger.error("Error updating stock prices", e);
        }
    }
    
}
