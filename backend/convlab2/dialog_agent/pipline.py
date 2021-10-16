from convlab2.nlu.jointBERT.crosswoz import BERTNLU
from convlab2.dst.rule.crosswoz.dst import RuleDST
from convlab2.policy.mle.crosswoz.mle import MLE
from convlab2.nlg.sclstm.crosswoz.sc_lstm import SCLSTM
from convlab2.dialog_agent import PipelineAgent, BiSession
from pprint import pprint
import random
import numpy as np
import torch

class Pipline():
    def _init_(self):
        nlu = BERTNLU(mode='all', config_file='crosswoz_all_context.json', 
                  model_file='https://convlab.blob.core.windows.net/convlab-2/bert_crosswoz_all_context.zip')
        policy = MLE()
        nlg = SCLSTM(is_user=False, use_cuda=False)


    def reply(current_state, utterance, context):
    '''
    input: 
    - current_state: (object)
    - utterance: (str)
    - context: ([str1, str2, ...])
    output: 
    - reply_utterance: (str)
    - new_current_state: (object)
    '''
        input_action = nlu.predict(utterance, context)
        dst = RuleDST(current_state=current_state)
        dst.update(input_action)
        dst.state['user_action'] = input_action
        output_action = policy.predict(dst.state)
        reply_utterance = nlg.generate(output_action)
        return(reply_utterance, dst.state)


    
    

    


