package com.tensai.projets.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PredictionResultDTO {
    @JsonProperty("estimated_cost_usd")
    private double estimatedCostUsd;

    @JsonProperty("duration_days")
    private double durationDays;

    @JsonProperty("workers_needed")
    private int workersNeeded;

    @JsonProperty("engineers")
    private int engineers;

    @JsonProperty("steel_tons")
    private double steelTons;

    public double getDurationDays() {
        return durationDays;
    }

    public double getEstimatedCostUsd() {
        return estimatedCostUsd;
    }

    public double getSteelTons() {
        return steelTons;
    }

    public int getEngineers() {
        return engineers;
    }

    public int getWorkersNeeded() {
        return workersNeeded;
    }

    public void setDurationDays(double durationDays) {
        this.durationDays = durationDays;
    }

    public void setEngineers(int engineers) {
        this.engineers = engineers;
    }

    public void setEstimatedCostUsd(double estimatedCostUsd) {
        this.estimatedCostUsd = estimatedCostUsd;
    }

    public void setSteelTons(double steelTons) {
        this.steelTons = steelTons;
    }

    public void setWorkersNeeded(int workersNeeded) {
        this.workersNeeded = workersNeeded;
    }

    public PredictionResultDTO(double estimatedCostUsd, double durationDays, int engineers, double steelTons) {
        this.estimatedCostUsd = estimatedCostUsd;
        this.durationDays = durationDays;
        this.engineers = engineers;
        this.steelTons = steelTons;
    }
}