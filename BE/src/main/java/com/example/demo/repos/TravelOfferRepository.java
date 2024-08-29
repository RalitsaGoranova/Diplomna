package com.example.demo.repos;

import com.example.demo.models.TravelOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TravelOfferRepository extends JpaRepository<TravelOffer, Long> {

    @Query("SELECT COUNT(t) > 0 FROM TravelOffer t WHERE t.travel.id = :travelId AND t.user.id = :userId")
    boolean existsByTravelIdAndUserId(@Param("travelId") Long travelId, @Param("userId") Long userId);


    @Query("SELECT COUNT(t) > 0 FROM Travel t WHERE t.id = :travelId AND t.user.id = :userId")
    boolean ifDriver(@Param("travelId") Long travelId, @Param("userId") Long userId);
}