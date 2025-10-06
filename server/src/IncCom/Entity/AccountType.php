<?php
namespace IncCom\Entity;

enum AccountType: string {
    case cash = 'cash';
    case credit_card = 'credit_card';
    case debit_card = 'debit_card';
    case bank_account = 'bank_account';
    case account = 'account';
    case investment = 'investment';
}
