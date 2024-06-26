package com.example.demo.repos;

import com.example.demo.models.TravelOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TravelOfferRepository extends JpaRepository<TravelOffer, Long> {

}
