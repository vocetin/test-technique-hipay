@regression
Feature: HiPay Fraud Management - Accessibilité WCAG 2.1
  En tant que visiteur de la page
  Je veux que la page soit accessible
  Afin que les utilisateurs avec des besoins spécifiques puissent l'utiliser

  Background:
    Given I am on the HiPay Fraud Management page
    And any cookie consent banner is dismissed

  @regression
  Scenario: La page ne présente aucune violation d'accessibilité critique
    Then the page should have no critical accessibility violations

  @regression
  Scenario: Le formulaire de contact est accessible
    When I click the "Request a tool demo" CTA
    And the contact form should be loaded and ready
    Then the contact form fields should have accessible labels

  @regression
  Scenario: Les boutons du carousel sont accessibles au clavier
    Then the carousel navigation buttons should be keyboard accessible
