#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, vec, Env, Vec};

#[contracttype]
pub enum DataKey {
    Votes(u32),
    TotalOptions,
}

#[contract]
pub struct PollContract;

#[contractimpl]
impl PollContract {
    /// Initialize poll with N options (call once after deploy)
    pub fn init(env: Env, num_options: u32) {
        env.storage().instance().set(&DataKey::TotalOptions, &num_options);
        for i in 0..num_options {
            env.storage().instance().set(&DataKey::Votes(i), &0u32);
        }
    }

    /// Vote for an option by index (0, 1, or 2)
    pub fn vote(env: Env, option: u32) -> u32 {
        let total: u32 = env.storage().instance().get(&DataKey::TotalOptions).unwrap_or(3);
        if option >= total {
            panic!("invalid option");
        }
        let current: u32 = env.storage().instance().get(&DataKey::Votes(option)).unwrap_or(0);
        let new_count = current + 1;
        env.storage().instance().set(&DataKey::Votes(option), &new_count);
        new_count
    }

    /// Get vote count for a specific option
    pub fn get_votes(env: Env, option: u32) -> u32 {
        env.storage().instance().get(&DataKey::Votes(option)).unwrap_or(0)
    }

    /// Get all results as a Vec
    pub fn get_results(env: Env) -> Vec<u32> {
        let total: u32 = env.storage().instance().get(&DataKey::TotalOptions).unwrap_or(3);
        let mut results = vec![&env];
        for i in 0..total {
            let votes: u32 = env.storage().instance().get(&DataKey::Votes(i)).unwrap_or(0);
            results.push_back(votes);
        }
        results
    }
}
