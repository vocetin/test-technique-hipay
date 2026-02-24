@regression
Feature: HiPay Fraud Management - Accessibilité WCAG 2.1

  Background:
    Given I am on the HiPay Fraud Management page
    And any cookie consent banner is dismissed

  @regression
  Scenario: La page ne présente aucune violation d'accessibilité critique
    Then the page should have no critical accessibility violations
