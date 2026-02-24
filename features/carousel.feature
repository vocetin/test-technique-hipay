@regression
Feature: HiPay Fraud Management - Carousel de fonctionnalités
  En tant que visiteur de la page
  Je veux naviguer dans le carousel de fonctionnalités
  Afin de découvrir les différentes capacités de la solution anti-fraude

  Background:
    Given I am on the HiPay Fraud Management page
    And any cookie consent banner is dismissed

  @regression
  Scenario: Le carousel affiche les slides et permet la navigation avant/arrière
    Then the carousel should be visible
    And the active carousel slide should show "Device fingerprint"
    When I click the next slide button
    Then the active carousel slide should show "Velocity controls"
    And the previous slide button should be enabled
    When I click the previous slide button
    Then the active carousel slide should show "Device fingerprint"
